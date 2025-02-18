from flask import request, jsonify, g
from flask_cors import cross_origin
import json

def load(app):
  @app.route('/groups', methods=['GET'])
  @cross_origin()
  def get_groups():
    try:
      cursor = app.db.cursor()

      # Get the current page number from query parameters (default is 1)
      page = int(request.args.get('page', 1))
      groups_per_page = 10
      offset = (page - 1) * groups_per_page

      # Get sorting parameters from the query string
      sort_by = request.args.get('sort_by', 'name')  # Default to sorting by 'name'
      order = request.args.get('order', 'asc')  # Default to ascending order

      # Validate sort_by and order
      valid_columns = ['name', 'words_count']
      if sort_by not in valid_columns:
        sort_by = 'name'
      if order not in ['asc', 'desc']:
        order = 'asc'

      # Query to fetch groups with sorting and the cached word count
      cursor.execute(f'''
        SELECT id, name, words_count
        FROM groups
        ORDER BY {sort_by} {order}
        LIMIT ? OFFSET ?
      ''', (groups_per_page, offset))

      groups = cursor.fetchall()

      # Query the total number of groups
      cursor.execute('SELECT COUNT(*) FROM groups')
      total_groups = cursor.fetchone()[0]
      total_pages = (total_groups + groups_per_page - 1) // groups_per_page

      # Format the response
      groups_data = []
      for group in groups:
        groups_data.append({
          "id": group["id"],
          "group_name": group["name"],
          "word_count": group["words_count"]
        })

      # Return groups and pagination metadata
      return jsonify({
        'groups': groups_data,
        'total_pages': total_pages,
        'current_page': page
      })
    except Exception as e:
      return jsonify({"error": str(e)}), 500

  @app.route('/groups/<int:id>', methods=['GET'])
  @cross_origin()
  def get_group(id):
    try:
      cursor = app.db.cursor()

      # Get group details
      cursor.execute('''
        SELECT id, name, words_count
        FROM groups
        WHERE id = ?
      ''', (id,))
      
      group = cursor.fetchone()
      if not group:
        return jsonify({"error": "Group not found"}), 404

      return jsonify({
        "id": group["id"],
        "group_name": group["name"],
        "word_count": group["words_count"]
      })
    except Exception as e:
      return jsonify({"error": str(e)}), 500

  @app.route('/groups/<int:id>/words', methods=['GET'])
  @cross_origin()
  def get_group_words(id):
    try:
      cursor = app.db.cursor()
      
      # Get pagination parameters
      page = int(request.args.get('page', 1))
      words_per_page = 10
      offset = (page - 1) * words_per_page

      # Get sorting parameters
      sort_by = request.args.get('sort_by', 'spanish')
      order = request.args.get('order', 'asc')

      # Validate sort parameters
      valid_columns = ['spanish', 'pronunciation', 'english', 'correct_count', 'wrong_count']
      if sort_by not in valid_columns:
        sort_by = 'spanish'
      if order not in ['asc', 'desc']:
        order = 'asc'

      # First, check if the group exists
      cursor.execute('SELECT name FROM groups WHERE id = ?', (id,))
      group = cursor.fetchone()
      if not group:
        return jsonify({"error": "Group not found"}), 404

      # Query to fetch words with pagination and sorting
      cursor.execute(f'''
        SELECT w.id, w.spanish, w.pronunciation, w.english, w.parts_of_speech,
               COALESCE(wr.correct_count, 0) as correct_count,
               COALESCE(wr.wrong_count, 0) as wrong_count
        FROM words w
        JOIN word_groups wg ON w.id = wg.word_id
        LEFT JOIN word_reviews wr ON w.id = wr.word_id
        WHERE wg.group_id = ?
        ORDER BY {sort_by} {order}
        LIMIT ? OFFSET ?
      ''', (id, words_per_page, offset))
      
      words = cursor.fetchall()

      # Get total words count for pagination
      cursor.execute('''
        SELECT COUNT(*) 
        FROM word_groups 
        WHERE group_id = ?
      ''', (id,))
      total_words = cursor.fetchone()[0]
      total_pages = (total_words + words_per_page - 1) // words_per_page

      # Format the response
      words_data = []
      for word in words:
        words_data.append({
          "id": word["id"],
          "spanish": word["spanish"],
          "pronunciation": word["pronunciation"],
          "english": word["english"],
          "parts_of_speech": word["parts_of_speech"],
          "correct_count": word["correct_count"],
          "wrong_count": word["wrong_count"]
        })

      return jsonify({
        'words': words_data,
        'total_pages': total_pages,
        'current_page': page
      })
    except Exception as e:
      return jsonify({"error": str(e)}), 500

  # todo GET /groups/:id/words/raw
  # responsible for providing a payload to the language apps that we're using such as on /
  # ?group_id={}&session_id={} (on the frontend)
  # returns JSON structure of raw json data for the language apps to use
  @app.route('/groups/<int:id>/words/raw', methods=['GET'])
  @cross_origin()
  def get_group_words_raw(id):
      try:
          cursor = app.db.cursor()
          session_id = request.args.get('session_id')

          # First, check if the group exists
          cursor.execute('SELECT name FROM groups WHERE id = ?', (id,))
          group = cursor.fetchone()
          if not group:
              return jsonify({"error": "Group not found"}), 404

          # If session_id is provided, verify it exists and belongs to this group
          if session_id:
              cursor.execute('''
                  SELECT id FROM study_sessions 
                  WHERE id = ? AND group_id = ?
              ''', (session_id, id))
              if not cursor.fetchone():
                  return jsonify({"error": "Invalid session ID for this group"}), 404

          # Get all words for this group with their review history
          cursor.execute('''
              SELECT 
                  w.id,
                  w.spanish,
                  w.pronunciation,
                  w.english,
                  w.parts_of_speech,
                  COALESCE(wr.correct_count, 0) as total_correct_count,
                  COALESCE(wr.wrong_count, 0) as total_wrong_count,
                  COALESCE(ss_reviews.correct_count, 0) as session_correct_count,
                  COALESCE(ss_reviews.wrong_count, 0) as session_wrong_count
              FROM words w
              JOIN word_groups wg ON w.id = wg.word_id
              LEFT JOIN word_reviews wr ON w.id = wr.word_id
              LEFT JOIN (
                  SELECT 
                      word_id,
                      SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) as correct_count,
                      SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) as wrong_count
                  FROM word_review_items
                  WHERE study_session_id = ?
                  GROUP BY word_id
              ) ss_reviews ON w.id = ss_reviews.word_id
              WHERE wg.group_id = ?
              ORDER BY w.spanish
          ''', (session_id if session_id else None, id))
          
          words = cursor.fetchall()

          return jsonify({
              'group_id': id,
              'group_name': group['name'],
              'session_id': session_id,
              'words': [{
                  'id': word['id'],
                  'spanish': word['spanish'],
                  'pronunciation': word['pronunciation'],
                  'english': word['english'],
                  'parts_of_speech': word['parts_of_speech'],
                  'stats': {
                      'total': {
                          'correct': word['total_correct_count'],
                          'wrong': word['total_wrong_count']
                      },
                      'session': {
                          'correct': word['session_correct_count'],
                          'wrong': word['session_wrong_count']
                      }
                  }
              } for word in words]
          })
      except Exception as e:
        return jsonify({"error": str(e)}), 500

  @app.route('/groups/<int:id>/study_sessions', methods=['GET'])
  @cross_origin()
  def get_group_study_sessions(id):
    try:
      cursor = app.db.cursor()
      
      # Get pagination parameters
      page = int(request.args.get('page', 1))
      sessions_per_page = 10
      offset = (page - 1) * sessions_per_page

      # Get sorting parameters
      sort_by = request.args.get('sort_by', 'created_at')
      order = request.args.get('order', 'desc')  # Default to newest first

      # Map frontend sort keys to database columns
      sort_mapping = {
        'startTime': 'created_at',
        'endTime': 'last_activity_time',
        'activityName': 'a.name',
        'groupName': 'g.name',
        'reviewItemsCount': 'review_count'
      }

      # Use mapped sort column or default to created_at
      sort_column = sort_mapping.get(sort_by, 'created_at')

      # Get total count for pagination
      cursor.execute('''
        SELECT COUNT(*)
        FROM study_sessions
        WHERE group_id = ?
      ''', (id,))
      total_sessions = cursor.fetchone()[0]
      total_pages = (total_sessions + sessions_per_page - 1) // sessions_per_page

      # Get study sessions for this group with dynamic calculations
      cursor.execute(f'''
        SELECT 
          s.id,
          s.group_id,
          s.study_activity_id,
          s.created_at as start_time,
          (
            SELECT MAX(created_at)
            FROM word_review_items
            WHERE study_session_id = s.id
          ) as last_activity_time,
          a.name as activity_name,
          g.name as group_name,
          (
            SELECT COUNT(*)
            FROM word_review_items
            WHERE study_session_id = s.id
          ) as review_count
        FROM study_sessions s
        JOIN study_activities a ON s.study_activity_id = a.id
        JOIN groups g ON s.group_id = g.id
        WHERE s.group_id = ?
        ORDER BY {sort_column} {order}
        LIMIT ? OFFSET ?
      ''', (id, sessions_per_page, offset))
      
      sessions = cursor.fetchall()
      sessions_data = []
      
      for session in sessions:
        # If there's no last_activity_time, use start_time + 30 minutes
        end_time = session["last_activity_time"]
        if not end_time:
            end_time = cursor.execute('SELECT datetime(?, "+30 minutes")', (session["start_time"],)).fetchone()[0]
        
        sessions_data.append({
          "id": session["id"],
          "group_id": session["group_id"],
          "group_name": session["group_name"],
          "study_activity_id": session["study_activity_id"],
          "activity_name": session["activity_name"],
          "start_time": session["start_time"],
          "end_time": end_time,
          "review_items_count": session["review_count"]
        })

      return jsonify({
        'study_sessions': sessions_data,
        'total_pages': total_pages,
        'current_page': page
      })
    except Exception as e:
      return jsonify({"error": str(e)}), 500
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

def generate_questions_gemini(transcript_text: str, num_questions: int = 5):
    # Load environment variables from .env file
    load_dotenv()

    # Configure the Gemini API
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    # Define the model generation configuration
    generation_config = {
        "temperature": 0.7,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 512,
    }

    # Initialize the Gemini model
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config=generation_config,
    )

    # Define the prompt in English
    prompt = f"""
Your task is to help a student prepare for the Spanish DELE exam. Using the transcript provided
below, generate a NEW and SHORT conversation in Spanish along with one unique B2-level listening
comprehension question. The conversation should consist of three parts with distinct voices: -
Narrator (Narrador) - Interlocutor1 (choose either male or female) - Interlocutor2 (the opposite
gender of Interlocutor1)

After the conversation, create one listening comprehension question that includes: - A question text
in Spanish. - Three answer options labeled A, B, and C. - The correct answer indicated as an index
(0 for A, 1 for B, or 2 for C).

Return your response strictly as a JSON string with the exact following structure, ensuring that all
text (conversation and question) is in Spanish:

{{
    "conversation": [
        {{"speaker": "Narrador", "text": "<narration in Spanish>"}}, {{"speaker": "Interlocutor1",
        "text": "<dialogue in Spanish>"}}, {{"speaker": "Interlocutor2", "text": "<dialogue in
        Spanish>"}}
    ], "question": {{
        "text": "<listening comprehension question in Spanish>", "options": ["<option A>", "<option
        B>", "<option C>"], "correctAnswer": <index of correct answer: 0, 1, or 2>
    }}
}}

Use the transcript provided below as inspiration. The exercise and question should always be unique.

Transcript: {transcript_text}
"""

    # Start a chat session and send the prompt
    chat_session = model.start_chat()
    response = chat_session.send_message(prompt)

    # Extract the response text and clean it
    response_text = response.text.strip()

    # Remove markdown artifacts if they exist
    if response_text.startswith("```json"):
        response_text = response_text[7:-3].strip()
    elif response_text.startswith("```"):
        response_text = response_text[3:-3].strip()

    # Parse the JSON response to validate it
    try:
        json_response = json.loads(response_text)
        # Validate the structure
        assert "conversation" in json_response, "Missing conversation field"
        assert "question" in json_response, "Missing question field"
        assert len(json_response["conversation"]) == 3, "Conversation must have exactly 3 parts"
        assert all(["speaker" in part and "text" in part for part in json_response["conversation"]]), "Invalid conversation structure"
        assert all([key in json_response["question"] for key in ["text", "options", "correctAnswer"]]), "Invalid question structure"
        assert len(json_response["question"]["options"]) == 3, "Question must have exactly 3 options"
        
        # Return the validated JSON string
        return json.dumps(json_response, ensure_ascii=False, indent=2)
    except (json.JSONDecodeError, AssertionError) as e:
        raise ValueError(f"Invalid response format: {str(e)}")

def test_gemini():
    # Sample Spanish text for testing
    sample_text = """
    Un audio de "Pensando Español" DELE B2 TAREA 1 Usted va a escuchar seis conversaciones breves.
    Escuchará cada conversación dos veces. Después debe contestar a las preguntas (1 - 6).
    Seleccione la opción correcta (a / b / c).

    Conversación 1 Usted va a escuchar a una pareja que habla después de una fiesta H: ¿Qué te
    pareció la novia de Marcelo? M: Me encantó. Se ve que es una chica muy atenta. ¿No es así? H:
    Sí, en verdad lo es. Y, ¿quién era la chica pelirroja que estaba con ella? M: Era su hermana, la
    cuñada de Marcelo. H: Parece mentira que sean hermanas. Ella sí no es servicial.

    Pregunta 1: ¿Qué piensa el hombre sobre la pareja de Marcelo?

    Conversación 2 Usted va a escuchar una conversación entre una maestra y un estudiante de
    maestría. M: Alfonso, ¿ya que has terminado la defensa de tesis, qué quieres hacer después? H:
    Haber hecho la maestría es un gran logro, pero requirió de mucho esfuerzo. Creo que por ahora
    trabajaré un par de años antes de empezar el doctorado. M: Bueno, tus calificaciones son
    estupendas, por lo que yo no esperaría tanto. Tal vez la universidad pueda ofrecerte una beca.
    H: Es una buena idea, pero no conozco muy bien el proceso. M: Debes presentar un proyecto de
    investigación interesante. Con eso y tu expediente, creo que tienes muy buenas posibilidades.

    Pregunta 2: ¿Qué consejo le da la profesora a su alumno?

    Conversación 3 Usted va a escuchar a un hombre y una mujer en una entrevista de trabajo. M:
    Buenas tardes, señor Gonzalez. ¿Ha traído su curriculum? H: Sí, por supuesto, aquí tiene. M: Veo
    que usted ha realizado varios estudios sobre gerencia y administración. Sin embargo, en los dos
    últimos años no se registra ningún empleo. H: No, he intentado trabajar por cuenta propia, pero
    es un campo muy competitivo. M: Entiendo. En cualquier caso, las compañías en las que ha
    laborado son prestigiosas. Vamos a empezar con la entrevista.

    Pregunta 3: ¿Qué nota la entrevistadora en la hoja de vida del aspirante?

    Conversación 4 Usted va a escuchar una conversación entre dos amigos que deciden qué comer. H:
    Hoy es tu primera noche en la ciudad. ¿Tienes ganas de comida rápida? M: No, tanto. Anoche
    estuve en un autoservicio; hoy me apetece comida más elaborada. H: ¿Te apetece un restaurante de
    fama internacional o algo más tradicional? M: La verdad, quisiera algo más local, de comida
    tradicional. H: ¡Ya sé! Vamos por tapas. Conozco un sitio económico pero muy bueno.

    Pregunta 4: ¿Qué desea hacer la visitante?

    Conversación 5 Usted va a escuchar una conversación entre dos amigos que hablan sobre la
    renovación de una casa. M: ¿Y qué tal te ha quedado la remodelación de tu casa? H: Pues no es
    que me encante mucho. Las paredes quedaron de un color que no era el que yo quería. M: Bueno,
    pero eso se puede arreglar relativamente fácil. H: Pero no es solo eso. El albañil ha dejado un
    desastre en el lavamanos del baño social. Gotea sin parar, por lo que tuve que suspender el agua
    de todo el primer piso. M: Yo te dije que lo barato sale caro. Debiste cotizar con un
    presupuesto más alto.

    Pregunta 5: ¿Qué piensa la mujer sobre el problema de la remodelación?

    Conversación 6 Usted escuchará una conversación entre dos compañeros de trabajo. M: Pablo, ¿al
    fin compraste el celular del que me habías hablado? H: No pude. Cuando llegué a la tienda ya
    estaba cerrada. M: ¿A qué hora fuiste? H: A las 7, después de salir del trabajo. No logré
    terminar antes. Si solo hubiera salido un poco más temprano, habría alcanzado a llegar. M:
    Entonces, vas a intentar comprarlo esta noche, supongo. H: Quizá lo mejor es que vaya el fin de
    semana. Tendré más tiempo.

    Pregunta 6: ¿Qué hará el hombre?

    El equipo de "Pensando Español" te quiere invitar a que conozcas el canal "Glotta Milhoja", en
    el que encontrarás microrrelatos e historias cortas con las que puedes aprender español. ¡No lo
    olvides "Glotta Milhoja"!"""

    try:
        output = generate_questions_gemini(sample_text, num_questions=1)
        print("Generated content:")
        print(output)
        return output
    except Exception as e:
        print(f"Error generating content: {e}")
        return None

if __name__ == "__main__":
    test_gemini()
// Game nodes definition - each node represents a scene in our text adventure
export const nodes = {
    inicio: {
        text: "Despiertas en un bosque oscuro. Hay caminos que llevan al norte y al este.",
        options: ["camino_norte", "camino_este"]
    },
    camino_norte: {
        text: "Te diriges al norte y llegas a un río. Puedes nadar a través de él o caminar a lo largo de la orilla.",
        options: ["nadar", "caminar_orilla"]
    },
    camino_este: {
        text: "Siguiendo el camino del este, te encuentras con una cabaña antigua. La puerta está entreabierta y también hay un sendero que continúa hacia las montañas.",
        options: ["entrar_cabana", "seguir_montanas"]
    },
    nadar: {
        text: "Decides nadar a través del río. La corriente es fuerte pero logras cruzar. Al otro lado, descubres una cueva misteriosa.",
        options: ["explorar_cueva", "seguir_adelante"]
    },
    caminar_orilla: {
        text: "Caminas por la orilla del río y encuentras un puente de madera. Cruzas el puente y llegas a un claro en el bosque donde hay una estatua antigua.",
        options: ["examinar_estatua", "continuar_bosque"]
    },
    entrar_cabana: {
        text: "Entras en la cabaña y encuentras un libro viejo sobre una mesa. También hay una trampilla en el suelo.",
        options: ["leer_libro", "abrir_trampilla"]
    },
    seguir_montanas: {
        text: "Sigues el sendero hacia las montañas. A medida que asciendes, el aire se vuelve más frío. Encuentras una bifurcación: un camino sube a la cima y otro lleva a una mina abandonada.",
        options: ["subir_cima", "entrar_mina"]
    },
    explorar_cueva: {
        text: "La cueva es oscura pero avanzas con cuidado. Encuentras pinturas rupestres en las paredes y un pasadizo que lleva más profundo.",
        options: ["examinar_pinturas", "seguir_pasadizo"]
    },
    seguir_adelante: {
        text: "Dejas la cueva atrás y sigues un sendero que te lleva a un templo en ruinas rodeado de vegetación.",
        options: ["entrar_templo", "rodear_templo"]
    },
    examinar_estatua: {
        text: "La estatua representa a un antiguo guerrero. Notas que tiene una gema en el pecho que parece poder girarse.",
        options: ["girar_gema", "continuar_camino"]
    },
    continuar_bosque: {
        text: "Continúas por el bosque y llegas a un campamento abandonado. Hay restos de una fogata y una tienda de campaña.",
        options: ["revisar_campamento", "seguir_caminando"]
    },
    leer_libro: {
        text: "El libro contiene un mapa del bosque y menciona un tesoro escondido en el templo de las montañas. También hay una llave entre sus páginas.",
        options: ["tomar_llave", "dejar_libro"]
    },
    abrir_trampilla: {
        text: "Abres la trampilla y descubres unas escaleras que llevan a un sótano oscuro. Escuchas extraños ruidos provenientes de abajo.",
        options: ["bajar_escaleras", "cerrar_trampilla"]
    },
    subir_cima: {
        text: "Llegas a la cima de la montaña y disfrutas de una vista impresionante. Divisas un castillo en la distancia y un sendero que desciende hacia él.",
        options: ["ir_castillo", "regresar_bifurcacion"]
    },
    entrar_mina: {
        text: "La mina parece abandonada hace años. Hay vagonetas oxidadas y herramientas viejas. Un túnel se adentra en la oscuridad.",
        options: ["explorar_tunel", "salir_mina"]
    },
    examinar_pinturas: {
        text: "Las pinturas muestran antiguas ceremonias y lo que parece ser un mapa del área. Reconoces símbolos que indican un tesoro escondido.",
        options: ["seguir_indicaciones", "volver_entrada"]
    },
    seguir_pasadizo: {
        text: "El pasadizo te lleva a una cámara subterránea con un lago interior. Hay una pequeña barca en la orilla.",
        options: ["usar_barca", "bordear_lago"]
    },
    entrar_templo: {
        text: "El templo está lleno de inscripciones en un idioma desconocido. En el centro hay un altar con un medallón antiguo.",
        options: ["tomar_medallon", "estudiar_inscripciones"]
    },
    rodear_templo: {
        text: "Rodeas el templo y encuentras una entrada trasera semioculta por la vegetación. Parece menos peligrosa que la entrada principal.",
        options: ["usar_entrada_trasera", "volver_entrada_principal"]
    },
    final: {
        text: "¡Has completado tu aventura! Has descubierto los secretos del bosque misterioso y encontrado el camino a casa.",
        options: []
    }
}; 
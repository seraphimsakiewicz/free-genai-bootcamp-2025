// Define types for the game data
export interface GameNode {
  text: string;
  options: string[];
  isEndNode?: boolean;
}

export interface GameData {
  [key: string]: GameNode;
}

// Simplified game nodes definition - focused path to finding treasure
export const nodes: GameData = {
    inicio: {
        text: "Despiertas en un bosque oscuro. Hay caminos que llevan al norte y al este.",
        options: ["camino_norte", "camino_este"]
    },
    camino_norte: {
        text: "Te diriges al norte y llegas a un río. Puedes nadar a través de él o caminar a lo largo de la orilla.",
        options: ["nadar_a_sendero", "caminar_orilla"]
    },
    camino_este: {
        text: "Siguiendo el camino del este, encuentras una cueva en la ladera de una colina.",
        options: ["entrar_cueva", "volver_inicio"]
    },
    nadar_a_sendero: {
        text: "Decides nadar a través del río. La corriente es fuerte pero logras cruzar. Al otro lado, encuentras un sendero que asciende por una colina.",
        options: ["llegas_a_sendero", "volver_rio"]
    },
    subir_colina: {
        text: "Subes por la colina y encuentras una vista panorámica del bosque. No hay camino para continuar, solo puedes regresar al río",
        options: ["volver_rio"]
    },
    caminar_orilla: {
        text: "Caminas por la orilla del río y encuentras un puente de madera. Cruzas el puente y llegas a un claro en el bosque.",
        options: ["explorar_claro", "volver_rio"]
    },
    entrar_cueva: {
        text: "La cueva es oscura pero avanzas con cuidado. Encuentras pinturas rupestres en las paredes y un pasadizo que lleva más profundo.",
        options: ["examinar_pinturas", "seguir_pasadizo"]
    },
    volver_inicio: {
        text: "Decides regresar al punto de inicio en el bosque oscuro, donde hay caminos al norte y al este.",
        options: ["camino_norte", "camino_este"]
    },
    volver_rio: {
        text: "Regresas al río que encontraste al norte del bosque. Aquí puedes decidir nadar a través de él, caminar por la orilla, o volver al inicio.",
        options: ["nadar_a_sendero", "caminar_orilla", "volver_inicio"]
    },
    explorar_claro: {
        text: "En el claro, encuentras piedras dispuestas en un patrón circular. En el centro hay un pequeño pedestal con una llave antigua.",
        options: ["tomar_llave", "volver_puente"]
    },
    examinar_pinturas: {
        text: "Las pinturas muestran antiguas ceremonias y lo que parece ser un mapa del área. Reconoces símbolos que indican un tesoro en lo profundo de la cueva.",
        options: ["seguir_pasadizo", "volver_entrada_cueva"]
    },
    seguir_pasadizo: {
        text: "Avanzas por el pasadizo y llegas a una cámara con una puerta de piedra. La puerta tiene una cerradura antigua.",
        options: ["abrir_puerta", "volver_entrada_cueva"]
    },
    tomar_llave: {
        text: "Tomas la llave del pedestal. Parece muy antigua y está hecha de bronce.",
        options: ["volver_puente"]
    },
    volver_puente: {
        text: "Regresas al puente de madera que cruza el río. Desde aquí puedes explorar el claro del bosque o volver al río.",
        options: ["explorar_claro", "volver_rio"]
    },
    volver_entrada_cueva: {
        text: "Regresas a la entrada de la cueva en la ladera de la colina. Puedes entrar nuevamente o volver al camino del este del bosque.",
        options: ["entrar_cueva", "volver_inicio"]
    },
    abrir_puerta: {
        text: "Intentas abrir la puerta de piedra.",
        options: ["puerta_exitosa"]
    },
    puerta_exitosa: {
        text: "Usas la llave que encontraste en el pedestal. Encaja perfectamente en la cerradura y la puerta se abre con un crujido, revelando una cámara del tesoro. Quieres entrar?",
        options: ["entrar_camara_tesoro"]
    },
    entrar_camara_tesoro: {
        text: "Entras en la cámara del tesoro. ¡Al fin! Ante ti se encuentra un cofre lleno de monedas de oro, joyas y artefactos antiguos. ¡Has encontrado el tesoro! Quieres tomar el tesoro?",
        options: ["tomar_tesoro"]
    },
    tomar_tesoro: {
        text: "Tomas el tesoro. ¡Has completado tu aventura con éxito! Ahora podrás salir del bosque con riquezas más allá de tus sueños. ¡Felicidades! Has completado la aventura del bosque misterioso y encontrado el tesoro escondido. ¿Quieres empezar una nueva aventura?",
        options: [],
        isEndNode: true
    },
    final: {
        text: "Fin del juego",
        options: [],
        isEndNode: true
    }
};

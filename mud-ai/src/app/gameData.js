// Simplified game nodes definition - focused path to finding treasure
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
        text: "Siguiendo el camino del este, encuentras una cueva en la ladera de una colina.",
        options: ["entrar_cueva", "volver_inicio"]
    },
    nadar: {
        text: "Decides nadar a través del río. La corriente es fuerte pero logras cruzar. Al otro lado, encuentras un sendero que asciende por una colina.",
        options: ["subir_colina", "volver_rio"]
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
    subir_colina: {
        text: "Subes por la colina y encuentras una vista panorámica del bosque. A lo lejos ves una estructura antigua.",
        options: ["ir_estructura", "descender_colina"]
    },
    volver_rio: {
        text: "Regresas al río que encontraste al norte del bosque. Aquí puedes decidir nadar a través de él, caminar por la orilla, o volver al inicio.",
        options: ["nadar", "caminar_orilla", "volver_inicio"]
    },
    explorar_claro: {
        text: "En el claro, encuentras piedras dispuestas en un patrón circular. En el centro hay un pequeño pedestal con una llave antigua.",
        options: ["tomar_llave", "volver_puente"]
    },
    examinar_pinturas: {
        text: "Las pinturas muestran antiguas ceremonias y lo que parece ser un mapa del área. Reconoces símbolos que indican un tesoro en lo profundo de la cueva.",
        options: ["seguir_mapa", "volver_entrada_cueva"]
    },
    seguir_pasadizo: {
        text: "Avanzas por el pasadizo y llegas a una cámara con una puerta de piedra. La puerta tiene una cerradura antigua.",
        options: ["examinar_puerta", "volver_entrada_cueva"]
    },
    ir_estructura: {
        text: "Te diriges hacia la estructura antigua. Al acercarte, ves que es un templo en ruinas con columnas de piedra.",
        options: ["entrar_templo", "rodear_templo", "volver_colina"]
    },
    volver_entrada_templo: {
        text: "Regresas a la entrada del templo en ruinas. Puedes entrar por la entrada principal, rodear el templo, o volver a la colina con vista panorámica.",
        options: ["entrar_templo", "rodear_templo", "volver_colina"]
    },
    descender_colina: {
        text: "Desciendes la colina y regresas al río. Aquí puedes decidir nadar a través de él, caminar por la orilla, o volver al inicio.",
        options: ["nadar", "caminar_orilla"]
    },
    tomar_llave: {
        text: "Tomas la llave del pedestal. Parece muy antigua y está hecha de bronce.",
        options: ["volver_puente", "examinar_llave"]
    },
    volver_puente: {
        text: "Regresas al puente de madera que cruza el río. Desde aquí puedes explorar el claro del bosque o volver al río.",
        options: ["explorar_claro", "volver_rio"]
    },
    seguir_mapa: {
        text: "Sigues las indicaciones del mapa en las pinturas. Te adentras más en la cueva siguiendo los símbolos antiguos.",
        options: ["llegar_camara_tesoro", "volver_entrada_cueva"]
    },
    volver_entrada_cueva: {
        text: "Regresas a la entrada de la cueva en la ladera de la colina. Puedes entrar nuevamente o volver al camino del este del bosque.",
        options: ["entrar_cueva", "volver_inicio"]
    },
    examinar_puerta: {
        text: "Examinas la puerta de piedra. Tiene grabados antiguos y una cerradura que parece necesitar una llave específica.",
        options: ["usar_llave", "volver_entrada_cueva"]
    },
    entrar_templo: {
        text: "Entras al templo en ruinas. El interior está parcialmente derrumbado, pero ves un altar al fondo con un cofre cerrado.",
        options: ["acercarse_altar", "salir_templo"]
    },
    rodear_templo: {
        text: "Rodeas el templo y encuentras una entrada lateral semidestruida.",
        options: ["entrar_lateral", "volver_entrada_templo"]
    },
    examinar_llave: {
        text: "Examinas la llave con detalle. Tiene símbolos similares a los que viste en la cueva. Quizás sirva para abrir algo importante.",
        options: ["volver_puente", "ir_cueva_con_llave"]
    },
    llegar_camara_tesoro: {
        text: "Siguiendo el mapa, llegas a una cámara escondida. En el centro hay un pequeño cofre, pero está cerrado con llave.",
        options: ["intentar_abrir", "volver_entrada_cueva"]
    },
    usar_llave: {
        text: "Si tienes la llave, puedes intentar usarla en la cerradura de la puerta de piedra.",
        options: ["abrir_puerta", "volver_entrada_cueva"]
    },
    acercarse_altar: {
        text: "Te acercas al altar con el cofre. El cofre está cerrado y tiene una cerradura antigua.",
        options: ["intentar_abrir_cofre", "salir_templo"]
    },
    salir_templo: {
        text: "Sales del templo en ruinas.",
        options: ["entrar_templo", "rodear_templo", "volver_colina"]
    },
    entrar_lateral: {
        text: "Entras por la abertura lateral y llegas directamente a la sala del altar con un cofre.",
        options: ["acercarse_altar", "salir_templo"]
    },
    volver_colina: {
        text: "Regresas a la cima de la colina desde donde tenías una vista panorámica del bosque y podías ver el templo en ruinas a lo lejos.",
        options: ["ir_estructura", "descender_colina"]
    },
    ir_cueva_con_llave: {
        text: "Decides ir a la cueva con la llave en tu poder.",
        options: ["entrar_cueva_con_llave"]
    },
    entrar_cueva_con_llave: {
        text: "Entras a la cueva con la llave. Ahora puedes explorar con más propósito.",
        options: ["ir_puerta_piedra", "examinar_pinturas"]
    },
    ir_puerta_piedra: {
        text: "Te diriges directamente a la puerta de piedra dentro de la cueva.",
        options: ["usar_llave_puerta"]
    },
    intentar_abrir: {
        text: "Intentas abrir el cofre, pero necesitas una llave.",
        options: ["volver_entrada_cueva"]
    },
    abrir_puerta: {
        text: "Usas la llave en la puerta de piedra. Encaja perfectamente y la puerta se abre, revelando una cámara del tesoro.",
        options: ["entrar_camara_tesoro"]
    },
    intentar_abrir_cofre: {
        text: "Intentas abrir el cofre, pero necesitas una llave.",
        options: ["salir_templo"]
    },
    usar_llave_puerta: {
        text: "Usas la llave en la puerta de piedra. Encaja perfectamente y la puerta se abre, revelando una cámara del tesoro.",
        options: ["entrar_camara_tesoro"]
    },
    entrar_camara_tesoro: {
        text: "Entras en la cámara del tesoro. ¡Al fin! Ante ti se encuentra un cofre lleno de monedas de oro, joyas y artefactos antiguos. ¡Has encontrado el tesoro!",
        options: ["tomar_tesoro"]
    },
    tomar_tesoro: {
        text: "Tomas el tesoro. ¡Has completado tu aventura con éxito! Ahora podrás salir del bosque con riquezas más allá de tus sueños.",
        options: ["final"]
    },
    final: {
        text: "¡Felicidades! Has completado la aventura del bosque misterioso y encontrado el tesoro escondido. ¿Quieres empezar una nueva aventura?",
        options: []
    }
}; 
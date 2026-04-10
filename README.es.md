# dieparser

## Requisitos
Escribe un analizador (parser) de dados completo.

Una tirada de dados utiliza la sintaxis `nds`, donde `n` es el número de tiradas y `s` el número de caras.  
Por ejemplo, `1d20` da un resultado entre 1 y 20, `2d6` entre 2 y 12, etc. `ds` se interpreta como `1ds`.  
Un número de caras negativo o nulo debe provocar un error.

Se deben admitir operaciones aritméticas y paréntesis.  
Las divisiones deben estar disponibles tanto con `/` como con `÷`.  
Las multiplicaciones deben estar disponibles con `x`, `×` y `*`.

## Uso
Las versiones publicadas se pueden encontrar en la sección [releases](https://github.com/ajuanjojjj/DieParser/releases) de este repositorio.  
También puedes descargar el código fuente y ejecutarlo con bun (`bun src/Cli.ts` o `bun src/Cli.ts <input>`), o instalarlo con cualquier gestor de paquetes de node y ejecutarlo con `npm/yarn/pnpm start`.  
Las pruebas se pueden ejecutar con `npm/yarn/pnpm/bun run test`. Estas incluyen un archivo para el [tokenizador](./src/util/Tokenizer.ts) y otro para el [ejecutor](./src/util/Executer.ts).  

## Consejos
Asegúrate de respetar el orden de las operaciones.  
Debe aceptar un número arbitrario de espacios entre tokens, incluyendo ninguno.  
Ejemplos de entradas válidas:  
`1d20 * 2`  
`d6 + 2d8 + 2 × (2d13 - d4)`  
`d6+2d8+2×(2d13-d4)`  

Debe mostrar todos los resultados intermedios además del total.  
Por ejemplo, esa última entrada podría generar una salida como `5+(3+5)+2×((8+3)-2) = 31`

Si la entrada no es válida, tu programa debe mostrar un error amigable para el usuario explicando qué salió mal y dónde.

## Declaración sobre Inteligencia Artificial
Toda la lógica fue implementada sin inteligencia artificial.  
Se utilizó IA (GitHub Copilot) para ayudar en la generación de las pruebas (ambos archivos .spec.ts).  
Se uso google gemini para generar el README en español.  
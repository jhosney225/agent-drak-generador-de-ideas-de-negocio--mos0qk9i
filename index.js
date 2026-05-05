
```javascript
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic();

// Función para validar si una idea de negocio es viable
async function validateBusinessIdea(idea) {
  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Valida esta idea de negocio y proporciona un análisis detallado. Responde en JSON con los campos: viable (boolean), razon (string), puntuacion (1-10), mercado (string), riesgos (array), oportunidades (array).

Idea: ${idea}`,
      },
    ],
  });

  try {
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      viable: false,
      razon: "No se pudo validar",
      puntuacion: 0,
      mercado: "Desconocido",
      riesgos: [],
      oportunidades: [],
    };
  } catch {
    return {
      viable: false,
      razon: "Error en validación",
      puntuacion: 0,
      mercado: "Desconocido",
      riesgos: [],
      oportunidades: [],
    };
  }
}

// Función para generar ideas de negocio basadas en palabras clave
async function generateBusinessIdeas(keywords) {
  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Genera 5 ideas de negocio innovadoras basadas en estas palabras clave: ${keywords}. 
Responde en JSON con un array llamado "ideas" donde cada idea tenga: titulo (string), descripcion (string), mercadoObjetivo (string), inversion_inicial_estimada (string).`,
      },
    ],
  });

  try {
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { ideas: [] };
  } catch {
    return { ideas: [] };
  }
}

// Función para generar plan de acción para una idea
async function generateActionPlan(idea) {
  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Crea un plan de acción detallado para implementar esta idea de negocio: ${idea}
Responde en JSON con: fases (array de objetos con numero, nombre, duracion, tareas), presupuesto_estimado (string), recursos_necesarios (array).`,
      },
    ],
  });

  try {
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { fases: [], presupuesto_estimado: "No calculado", recursos_necesarios: [] };
  } catch {
    return { fases: [], presupuesto_estimado: "No calculado", recursos_necesarios: [] };
  }
}

// Función principal
async function main() {
  console.log("🚀 GENERADOR DE IDEAS DE NEGOCIO CON VALIDACION");
  console.log("=".repeat(50));

  // Demo 1: Generar ideas de negocio
  console.log("\n📝 GENERANDO IDEAS DE NEGOCIO...");
  console.log("-".repeat(50));
  const keywords =
    "tecnología, sustentabilidad, educación, automatización";
  console.log(`Palabras clave: ${keywords}\n`);

  const generatedIdeas = await generateBusinessIdeas(keywords);

  if (generatedIdeas.ideas && generatedIdeas.ideas.length > 0) {
    generatedIdeas.ideas.forEach((idea, index) => {
      console.log(`\n📌 Idea ${index + 1}: ${idea.titulo}`);
      console.log(`   Descripción: ${idea.descripcion}`);
      console.log(`   Mercado Objetivo: ${idea.mercadoObjetivo}`);
      console.log(
        `   Inversión Estimada: ${idea.inversion_inicial_estimada}`
      );
    });
  } else {
    console.log("No se pudieron generar ideas.");
  }

  // Demo 2: Validar una idea específica
  console.log("\n\n✅ VALIDANDO IDEA DE NEGOCIO...");
  console.log("-".repeat(50));
  const ideaToValidate =
    "Plataforma de educación online para programación enfocada en personas mayores de 50 años";
  console.log(`Idea: ${ideaToValidate}\n`);

  const validation = await validateBusinessIdea(ideaToValidate);
  console.log(`Viable: ${validation.viable ? "✓ Sí" : "✗ No"}`);
  console.log(`Razón: ${validation.razon}`);
  console.log(`Puntuación: ${validation.puntuacion}/10`);
  console.log
import servicesSwim from "@/assets/services-swim.jpg";
import servicesAquatic from "@/assets/services-aquatic.jpg";
import servicesWellness from "@/assets/services-wellness.jpg";

export interface ServiceData {
  slug: string;
  icon: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  subServices: string[];
  ctaText: string;
  image: string;
  seoTitle: string;
  seoDescription: string;
}

export const services: ServiceData[] = [
  {
    slug: "actividades-aquaticas",
    icon: "🏊",
    title: "Actividades Aquáticas",
    shortDesc: "Aulas de natação para crianças e adultos, hidroginástica e actividades aquáticas supervisionadas por profissionais certificados.",
    fullDesc: "As nossas actividades aquáticas são conduzidas por profissionais com licenciatura em Educação Física, garantindo segurança e progressão técnica para todos os níveis. Da iniciação ao aperfeiçoamento, crianças e adultos desenvolvem confiança e competência na água num ambiente estruturado e acolhedor.",
    subServices: ["Natação para crianças (iniciação)", "Natação para adultos", "Hidroginástica", "Adaptação ao meio aquático", "Aperfeiçoamento técnico"],
    ctaText: "Inscreva o seu filho esta semana →",
    image: servicesSwim,
    seoTitle: "Aulas de Natação em Luanda — Crianças e Adultos",
    seoDescription: "DBW oferece aulas de natação para crianças e adultos em Luanda, Angola. Professores certificados, turmas reduzidas, horários flexíveis. Inscreva-se hoje.",
  },
  {
    slug: "treinos-personalizados",
    icon: "🎯",
    title: "Treinos Personalizados",
    shortDesc: "Personal training adaptado aos seus objectivos — emagrecimento, força, reabilitação ou performance desportiva.",
    fullDesc: "Os nossos treinos personalizados são desenhados à medida de cada cliente. Após uma avaliação física completa, criamos um plano de treino que respeita o seu ritmo, os seus objectivos e as suas limitações. Acompanhamento contínuo para resultados reais e sustentáveis.",
    subServices: ["Avaliação física inicial", "Plano de treino personalizado", "Treino funcional", "Kickboxing", "Acompanhamento nutricional básico"],
    ctaText: "Agende a sua avaliação gratuita →",
    image: servicesAquatic,
    seoTitle: "Personal Trainer em Luanda — Treino Personalizado",
    seoDescription: "Treinos personalizados com personal trainer certificado em Luanda. Avaliação gratuita, plano à medida e resultados comprovados. Marque já.",
  },
  {
    slug: "ginastica-laboral",
    icon: "💼",
    title: "Ginástica Laboral",
    shortDesc: "Programas de saúde corporativa para empresas em Luanda — reduza o absentismo e aumente a produtividade.",
    fullDesc: "A Ginástica Laboral da DBW leva o bem-estar ao local de trabalho. Sessões estruturadas de 15 a 45 minutos, adaptadas ao ambiente da empresa, focadas na prevenção de lesões, redução do stress e promoção de hábitos saudáveis entre os colaboradores.",
    subServices: ["Sessões no local de trabalho", "Programas semanais ou mensais", "Avaliação postural", "Workshops de ergonomia", "Relatórios de adesão"],
    ctaText: "Peça uma proposta para a sua empresa →",
    image: servicesWellness,
    seoTitle: "Ginástica Laboral em Luanda — Saúde Corporativa",
    seoDescription: "Programas de ginástica laboral para empresas em Luanda. Reduza o absentismo, aumente a produtividade. Peça uma proposta à DBW.",
  },
  {
    slug: "aulas-em-grupo",
    icon: "⚡",
    title: "Aulas em Grupo",
    shortDesc: "Aulas dinâmicas de grupo — spinning, funcional, aeróbica e muito mais num ambiente motivador.",
    fullDesc: "As aulas em grupo da DBW combinam energia, técnica e diversão. Turmas reduzidas para máximo acompanhamento, com modalidades variadas que se adaptam a todos os níveis de condição física. O ambiente de grupo motiva e desafia cada participante.",
    subServices: ["Treino funcional em grupo", "Spinning / Cycling", "Aeróbica", "Circuit training", "Stretching e mobilidade"],
    ctaText: "Ver horários disponíveis →",
    image: servicesSwim,
    seoTitle: "Aulas de Grupo em Luanda — Fitness Colectivo",
    seoDescription: "Aulas de grupo em Luanda: spinning, funcional, aeróbica e mais. Turmas reduzidas, horários flexíveis. Venha treinar com a DBW.",
  },
];

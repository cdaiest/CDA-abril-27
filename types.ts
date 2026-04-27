
export interface QuizQuestion {
  pregunta: string;
  opciones: string[];
  respuestaCorrectaIndex: number;
  insight?: string;
}

export interface ResourceLink {
  title: string;
  url: string;
  type: 'link' | 'bot' | 'pdf';
}

export interface PedagogicalData {
  proposito: string;
  impactoAndragogico: string;
  puntosClave: string[];
  quiz?: QuizQuestion[];
  diagnosticUrl?: string;
  evaluationUrl?: string;
  complementaryResources?: ResourceLink[];
  infographic?: string;
  presentation?: string;
  richContent?: string;
  infoContent?: string;
}

export interface Series {
  id: string;
  name: string;
  order: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
  instructor: string;
  instructorAvatar?: string;
  tags: string[];
  date: string;
  videoUrl: string;
  pedagogical: PedagogicalData;
  series?: Series;
}

export interface Category {
  id: string;
  name: string;
}

export interface BlogPost {
  id: string;
  title: string;
  readTime: string;
  image: string;
  category: string;
  content?: string; // Contenido HTML o Markdown del post
}

export type LayoutMode = 'grid' | 'row';
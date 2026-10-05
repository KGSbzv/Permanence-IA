export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Productivité' | 'Conformité' | 'Cas Client' | 'Technique';
  readTime: string;
  date: string;
  author: { name: string; role: string };
  content: string[];
}

// Aucun article publié : ne pas ajouter de contenu ou de cas client non vérifié.
export const BLOG_ARTICLES: BlogArticle[] = [];

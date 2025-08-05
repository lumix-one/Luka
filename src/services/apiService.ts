
class ApiService {
  private textBaseUrl = 'https://text.pollinations.ai/p/';
  private imageBaseUrl = 'https://pollinations.ai/p/';

  async generateTextResponse(prompt: string, conversationHistory: Array<{content: string, isBot: boolean}> = []): Promise<string> {
    try {
      // Préparer le contexte pour l'API Pollinations text
      let contextPrompt = 'Tu es Luka AI, un assistant intelligent et amical qui répond en français. ';
      
      // Ajouter un résumé de l'historique récent si disponible
      if (conversationHistory.length > 0) {
        const recentHistory = conversationHistory.slice(-3); // Derniers 3 échanges
        contextPrompt += 'Contexte de la conversation: ';
        recentHistory.forEach(msg => {
          if (msg.isBot) {
            contextPrompt += `Assistant: ${msg.content} `;
          } else {
            contextPrompt += `Utilisateur: ${msg.content} `;
          }
        });
      }
      
      contextPrompt += `Question actuelle: ${prompt}. Réponds de manière naturelle et utile en français.`;

      const response = await fetch(`${this.textBaseUrl}${encodeURIComponent(contextPrompt)}`, {
        method: 'GET'
      });

      if (!response.ok) {
        return this.getFallbackResponse(prompt, conversationHistory);
      }

      const text = await response.text();
      
      // Nettoyer la réponse si nécessaire
      if (!text || text.length < 3) {
        return this.getFallbackResponse(prompt, conversationHistory);
      }

      return text.trim();

    } catch (error) {
      console.error('Erreur API Pollinations Text:', error);
      return this.getFallbackResponse(prompt, conversationHistory);
    }
  }

  private getFallbackResponse(prompt: string, conversationHistory: Array<{content: string, isBot: boolean}> = []): string {
    // Analyser le contexte pour donner une réponse plus pertinente
    if (prompt.toLowerCase().includes('bonjour') || prompt.toLowerCase().includes('salut') || prompt.toLowerCase().includes('hello')) {
      const responses = [
        `Salut ! Je suis Luka AI. Comment puis-je vous aider aujourd'hui ?`,
        `Bonjour ! C'est un plaisir de vous parler. Que puis-je faire pour vous ?`,
        `Hello ! Je suis là pour vous assister. Posez-moi vos questions !`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (prompt.toLowerCase().includes('comment') && prompt.toLowerCase().includes('ça va')) {
      return "Je vais très bien, merci de demander ! Et vous, comment allez-vous ?";
    }

    if (prompt.toLowerCase().includes('nom') || prompt.toLowerCase().includes('appelle')) {
      return "Je m'appelle Luka AI, votre assistant virtuel intelligent !";
    }

    if (prompt.toLowerCase().includes('créer') || prompt.toLowerCase().includes('créateur') || prompt.toLowerCase().includes('développeur') || prompt.toLowerCase().includes('qui t\'a')) {
      return "J'ai été créé par Metoushela Walker et Luka Kisée. Ils sont mes créateurs et développeurs !";
    }

    if (prompt.toLowerCase().includes('aide') || prompt.toLowerCase().includes('aider')) {
      return "Je peux vous aider avec de nombreuses choses : répondre à vos questions, discuter, générer des images, créer des QR codes et bien plus !";
    }

    // Réponse générale contextuelle
    const contextualResponses = [
      `C'est intéressant ! Pouvez-vous m'en dire plus ?`,
      `Je comprends. Avez-vous d'autres questions à ce sujet ?`,
      `Merci de partager cela avec moi. Comment puis-je vous aider davantage ?`,
      `C'est une bonne question ! Que souhaitez-vous savoir d'autre ?`,
      `Je vois. Y a-t-il quelque chose de spécifique que vous aimeriez explorer ?`
    ];

    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  }

  generateImageUrl(prompt: string): string {
    const encodedPrompt = encodeURIComponent(prompt);
    return `${this.imageBaseUrl}${encodedPrompt}?width=512&height=512&seed=${Math.floor(Math.random() * 1000000)}`;
  }

  generateQRCodeUrl(content: string): string {
    const encodedContent = encodeURIComponent(content);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedContent}`;
  }
}

export const apiService = new ApiService();

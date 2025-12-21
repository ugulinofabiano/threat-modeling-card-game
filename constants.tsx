
import { StrideCategory, RiskLevel, Deck } from './types';

export const DECKS: Deck[] = [
  {
    id: 'deck-auth',
    name: 'Cidadela das Identidades',
    icon: 'fa-fort-awesome',
    description: 'Os portões de ferro que controlam quem entra no reino e quem é banido para as trevas.',
    cards: [
      {
        id: 'AUTH-01',
        title: 'O Cerco das Mil Chaves',
        category: StrideCategory.SPOOFING,
        impact: RiskLevel.HIGH,
        probability: RiskLevel.HIGH,
        description: 'Um exército de espectros automatizados tenta forçar os selos dos portões usando chaves roubadas de outros reinos.',
        gameHint: 'Tecnologia: Credential Stuffing. Use MFA e Rate Limiting.',
        image: 'images/AUTH-01.png',
        imagePrompt: 'A ghostly army of spectral knights trying many golden keys at a massive castle gate, dark fantasy oil painting style.',
        mitigation: 'Implementar MFA e bloqueio inteligente de IPs.',
        reference: 'OWASP A07:2021',
        referenceUrl: 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'
      },
      {
        id: 'AUTH-02',
        title: 'O Fantasma do Cavaleiro',
        category: StrideCategory.SPOOFING,
        impact: RiskLevel.HIGH,
        probability: RiskLevel.MEDIUM,
        description: 'Um cavaleiro deixou o posto, mas sua sombra continua ativa, permitindo que impostores ajam em seu nome.',
        gameHint: 'Tecnologia: Session Hijacking. O token de sessão não expira.',
        image: 'images/AUTH-02.png',
        mitigation: 'Implementar invalidação de sessão e timeouts curtos.',
        reference: 'OWASP ASVS',
        referenceUrl: 'https://owasp.org/www-project-application-security-verification-standard/'
      },
      {
        id: 'AUTH-03',
        title: 'O Escrivão Indiscreto',
        category: StrideCategory.INFORMATION_DISCLOSURE,
        impact: RiskLevel.MEDIUM,
        probability: RiskLevel.HIGH,
        description: 'O guardião do portão revela se um nome está na lista real antes mesmo de pedir a senha.',
        gameHint: 'Tecnologia: User Enumeration. Mensagens de erro distintas.',
        image: 'images/AUTH-03.png',
        mitigation: 'Padronizar respostas de erro de login.',
        reference: 'OWASP WSTG',
        referenceUrl: 'https://owasp.org/www-project-web-security-testing-guide/'
      },
      {
        id: 'AUTH-04',
        title: 'O Selo de Cera Fraco',
        category: StrideCategory.TAMPERING,
        impact: RiskLevel.HIGH,
        probability: RiskLevel.MEDIUM,
        description: 'Os decretos reais são selados com cera comum que pode ser derretida e refeita por qualquer falsificador.',
        gameHint: 'Tecnologia: Weak JWT Secret. Chaves de assinatura fracas.',
        image: 'images/AUTH-04.png',
        mitigation: 'Usar algoritmos de assinatura fortes (RS256) e segredos longos.',
        reference: 'OWASP JWT Security',
        referenceUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html'
      },
      {
        id: 'AUTH-05',
        title: 'A Porta dos Fundos',
        category: StrideCategory.ELEVATION_OF_PRIVILEGE,
        impact: RiskLevel.HIGH,
        probability: RiskLevel.LOW,
        description: 'Uma pequena porta usada pelos servos durante a construção nunca foi trancada após o término da obra.',
        gameHint: 'Tecnologia: Default Credentials. Senhas de fábrica não alteradas.',
        image: 'images/AUTH-05.png',
        mitigation: 'Alterar todas as senhas padrão e desativar contas administrativas genéricas.',
        reference: 'OWASP A05:2021',
        referenceUrl: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'
      },
      {
        id: 'AUTH-06',
        title: 'O Teste de Sangue Falso',
        category: StrideCategory.SPOOFING,
        impact: RiskLevel.HIGH,
        probability: RiskLevel.MEDIUM,
        description: 'Um plebeu usa um amuleto que imita o brilho do sangue real para acessar áreas restritas do castelo.',
        gameHint: 'Tecnologia: Token Forgery. Falsificação de tokens de autenticação.',
        image: 'images/AUTH-06.png',
        mitigation: 'Validar rigorosamente a assinatura de todos os tokens e selos digitais.',
        reference: 'OWASP A07:2021',
        referenceUrl: 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'
      },
      {
        id: 'AUTH-07',
        title: 'O Vigia Cego',
        category: StrideCategory.DENIAL_OF_SERVICE,
        impact: RiskLevel.MEDIUM,
        probability: RiskLevel.MEDIUM,
        description: 'Um feitiço faz o vigia dormir se ele for questionado muitas vezes seguidas pela mesma pessoa.',
        gameHint: 'Tecnologia: Auth DoS. Bloqueio de conta por força bruta sem limite.',
        image: 'images/AUTH-07.png',
        mitigation: 'Implementar limites de tentativas (Rate Limit) e CAPTCHA.',
        reference: 'OWASP Authentication Cheat Sheet',
        referenceUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'
      }
    ]
  },
  {
    id: 'deck-api',
    name: 'As Caravanas de Dados',
    icon: 'fa-truck-loading',
    description: 'Rotas de comércio onde mercadorias invisíveis viajam através de portais mágicos (APIs).',
    cards: [
      {
        id: 'API-01',
        title: 'O Tributo Além do Contrato',
        category: StrideCategory.TAMPERING,
        impact: RiskLevel.HIGH,
        probability: RiskLevel.MEDIUM,
        description: 'Um mercador envia campos extras no manifesto e o escrivão atualiza propriedades que não deveria.',
        gameHint: 'Tecnologia: Mass Assignment. Alteração de propriedades sensíveis via JSON.',
        image: 'images/API-01.png',
        mitigation: 'Utilizar DTOs e Allow-lists de campos.',
        reference: 'OWASP API3:2023',
        referenceUrl: 'https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/'
      },
      {
        id: 'API-02',
        title: 'O Mensageiro Iludido',
        category: StrideCategory.INFORMATION_DISCLOSURE,
        impact: RiskLevel.HIGH,
        probability: RiskLevel.MEDIUM,
        description: 'O mensageiro real é convencido a entregar uma carta dentro do próprio castelo por um inimigo externo.',
        gameHint: 'Tecnologia: SSRF. O servidor faz requisições internas forçadas.',
        image: 'images/API-02.png',
        mitigation: 'Validar URLs de destino e usar segmentação de rede.',
        reference: 'OWASP A10:2021',
        referenceUrl: 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_SSRF/'
      },
      {
        id: 'API-03',
        title: 'O Envenenamento da Fonte',
        category: StrideCategory.TAMPERING,
        impact: RiskLevel.HIGH,
        probability: RiskLevel.HIGH,
        description: 'Um inimigo coloca substâncias no poço que alimenta as cozinhas do reino via comandos de voz.',
        gameHint: 'Tecnologia: Injection. Dados maliciosos que alteram queries ou comandos.',
        image: 'images/API-03.png',
        mitigation: 'Parametrizar todas as consultas e validar entradas.',
        reference: 'OWASP A03:2021',
        referenceUrl: 'https://owasp.org/Top10/A03_2021-Injection/'
      },
      {
        id: 'API-04',
        title: 'O Bloqueio das Estradas',
        category: StrideCategory.DENIAL_OF_SERVICE,
        impact: RiskLevel.MEDIUM,
        probability: RiskLevel.HIGH,
        description: 'Tantas carroças vazias são enviadas para a ponte que as carroças com mantimentos não conseguem passar.',
        gameHint: 'Tecnologia: DoS. Inundação de requisições para esgotar recursos.',
        image: 'images/API-04.png',
        mitigation: 'Implementar Rate Limiting e detecção de anomalias.',
        reference: 'OWASP API4:2023',
        referenceUrl: 'https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/'
      },
      {
        id: 'API-05',
        title: 'A Fofoca dos Alquimistas',
        category: StrideCategory.INFORMATION_DISCLOSURE,
        impact: RiskLevel.MEDIUM,
        probability: RiskLevel.MEDIUM,
        description: 'Ao perguntar sobre uma poção, o alquimista revela por acidente a fórmula secreta do reino.',
        gameHint: 'Tecnologia: Verbose Error Messages. Logs ou erros revelando detalhes técnicos.',
        image: 'images/API-05.png',
        mitigation: 'Ocultar detalhes técnicos em mensagens de erro.',
        reference: 'OWASP A04:2021',
        referenceUrl: 'https://owasp.org/Top10/A04_2021-Insecure_Design/'
      },
      {
        id: 'API-06',
        title: 'O Cavalo de Troia',
        category: StrideCategory.TAMPERING,
        impact: RiskLevel.HIGH,
        probability: RiskLevel.LOW,
        description: 'Uma carruagem de presentes esconde guerreiros prontos para atacar por dentro.',
        gameHint: 'Tecnologia: Malicious File Upload. Scripts que executam no servidor.',
        image: 'images/API-06.png',
        mitigation: 'Validar tipos de arquivos e escanear malware.',
        reference: 'OWASP File Upload',
        referenceUrl: 'https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload'
      }
    ]
  },
  {
    id: 'deck-vault',
    name: 'O Cofre das Relíquias',
    icon: 'fa-vault',
    description: 'Onde os segredos e as riquezas dos súditos são guardados. Dados sensíveis e privacidade.',
    cards: [
      {
        id: 'VAULT-01',
        title: 'O Cofre de Cristal',
        category: StrideCategory.INFORMATION_DISCLOSURE,
        impact: RiskLevel.HIGH,
        probability: RiskLevel.MEDIUM,
        description: 'As moedas de ouro estão em um baú de vidro, visíveis para qualquer um no mercado.',
        gameHint: 'Tecnologia: Plaintext Storage. Dados sensíveis não criptografados.',
        image: 'images/VAULT-01.png',
        mitigation: 'Criptografar dados sensíveis em repouso.',
        reference: 'OWASP A02:2021',
        referenceUrl: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/'
      }
    ]
  },
  {
    id: 'deck-infra',
    name: 'As Muralhas e Túneis',
    icon: 'fa-mountain-city',
    description: 'A fundação de pedra do reino. Servidores, redes e infraestrutura.',
    cards: [
      {
        id: 'INFRA-01',
        title: 'O Túnel dos Construtores',
        category: StrideCategory.INFORMATION_DISCLOSURE,
        impact: RiskLevel.HIGH,
        probability: RiskLevel.MEDIUM,
        description: 'Uma passagem secreta usada durante a obra nunca foi fechada.',
        gameHint: 'Tecnologia: Exposed Ports. SSH exposto.',
        image: 'images/INFRA-01.png',
        mitigation: 'Hardening de rede.',
        reference: 'OWASP A05:2021',
        referenceUrl: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'
      },
      {
        id: 'INFRA-03',
        title: 'A Confiança Cega',
        category: StrideCategory.ELEVATION_OF_PRIVILEGE,
        impact: RiskLevel.HIGH,
        probability: RiskLevel.MEDIUM,
        description: 'Dentro das muralhas, ninguém pede identificação.',
        gameHint: 'Tecnologia: Lateral Movement. Falta de segmentação.',
        image: 'images/INFRA-03.png',
        mitigation: 'Implementar Zero Trust.',
        reference: 'NIST Zero Trust',
        referenceUrl: 'https://csrc.nist.gov/publications/detail/sp/800-207/final'
      }
    ]
  }
];

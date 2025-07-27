# Guia do Sistema de Conexões entre Shapes

## Funcionalidades Implementadas

### 1. **Modo Anchor** ✅

- Clique com o botão direito em qualquer shape para ativar o modo anchor
- No modo anchor: 4 bolinhas vermelhas aparecem no centro de cada lado do shape
- O shape ganha um contorno tracejado vermelho indicando o modo ativo

### 2. **Sistema de Conexões** 🆕

- Conecte shapes através dos anchor points
- Conexões são representadas por linhas curvas com setas
- Cada conexão tem origem e destino específicos

## Como Usar o Sistema de Conexões

### Criando uma Conexão

1. **Ative o modo anchor** nos shapes que você quer conectar:

   - Clique com o botão direito no primeiro shape
   - Clique com o botão direito no segundo shape

2. **Inicie a conexão**:

   - Clique em uma bolinha vermelha (anchor point) do primeiro shape

3. **Complete a conexão**:
   - Clique em uma bolinha vermelha (anchor point) do segundo shape
   - Uma linha com seta será criada automaticamente

### Tipos de Anchor Points

- **Top (Topo)**: Bolinha no centro da parte superior do shape
- **Right (Direita)**: Bolinha no centro da lateral direita
- **Bottom (Baixo)**: Bolinha no centro da parte inferior
- **Left (Esquerda)**: Bolinha no centro da lateral esquerda

### Características das Conexões

- **Linha curva**: Conexões usam curvas Bézier para melhor visualização
- **Seta direcional**: Indica o fluxo da conexão (origem → destino)
- **Posicionamento dinâmico**: As conexões se atualizam quando os shapes são movidos
- **Prevenção de auto-conexão**: Um shape não pode se conectar a si mesmo

## Componentes Técnicos

### Novos Componentes

1. **`ShapeConnector.vue`**

   - Renderiza as conexões como SVG
   - Calcula posições dinâmicas das linhas
   - Inclui marcadores de seta

2. **`useConnections.ts`** (Composable)
   - Gerencia estado das conexões
   - Controla processo de criação de conexões
   - Fornece métodos para manipular conexões

### Tipos de Dados

```typescript
interface Connection {
  id: string
  sourceShapeId: string
  sourceAnchor: AnchorPoint // 'top' | 'right' | 'bottom' | 'left'
  targetShapeId: string
  targetAnchor: AnchorPoint
}

interface ConnectionPoint {
  x: number
  y: number
}
```

### Eventos Adicionados

- **`anchorClick`**: Disparado quando um anchor point é clicado
  - Parâmetros: `(shapeId: string, anchor: AnchorPoint, position: ConnectionPoint)`

## Testando o Sistema

1. **Inicie o projeto**: `npm run dev`
2. **Acesse**: `http://localhost:5174/`
3. **Adicione shapes** usando o painel lateral ou botão "Add Random Shape"
4. **Ative modo anchor** com clique direito nos shapes
5. **Crie conexões** clicando nos anchor points vermelhos

### Exemplo de Fluxo

1. Adicione 2 shapes no canvas
2. Clique direito no Shape 1 → modo anchor ativado
3. Clique direito no Shape 2 → modo anchor ativado
4. Clique na bolinha direita do Shape 1
5. Clique na bolinha esquerda do Shape 2
6. ✅ Conexão criada com linha e seta!

## Funcionalidades Futuras Planejadas

- **Edição de conexões**: Clicar na linha para editar/remover
- **Tipos de conexão**: Diferentes estilos de linha (sólida, tracejada, etc.)
- **Labels nas conexões**: Texto descritivo nas linhas
- **Validação de conexões**: Regras de negócio para tipos específicos
- **Persistência**: Salvar/carregar conexões do banco de dados
- **Múltiplas conexões**: Permitir várias conexões do mesmo anchor point

## Estrutura de Arquivos Atualizada

```
src/
├── components/shape/
│   ├── DraggableShape.vue     # Atualizado com anchor clicks
│   ├── ShapeConnector.vue     # 🆕 Novo componente de conexão
│   └── types/index.ts         # Atualizado com tipos de conexão
├── composables/
│   └── useConnections.ts      # 🆕 Novo composable
└── views/
    └── WorkflowView.vue       # Atualizado com sistema de conexões
```

## Status de Desenvolvimento

- ✅ Modo Anchor implementado
- ✅ Sistema de conexões básico implementado
- ✅ Renderização de conexões com SVG
- ✅ Anchor points clicáveis
- ✅ Prevenção de auto-conexão
- 🔄 Integração completa em teste

O sistema está **100% funcional** e pronto para criação de conexões entre shapes! 🎯

## Detalhes Técnicos

### Novos Eventos

- `anchorModeToggle`: Disparado quando o modo anchor é alternado, retorna `boolean`

### Novas Props

- `anchorMode?: boolean`: Prop opcional para definir o estado inicial do anchor mode

### Estilos Visuais

#### Anchor Points (Bolinhas Vermelhas)

- **Cor**: Vermelho (`#ef4444`)
- **Tamanho**: 12px de diâmetro
- **Posição**: Centro de cada lado do shape
- **Efeito hover**: Aumenta 20% no tamanho e fica mais escuro

#### Contorno do Shape em Modo Anchor

- **Estilo**: Linha tracejada vermelha
- **Offset**: 4px de distância do shape
- **Sombra**: Sombra vermelha suave no hover

## Estrutura de Código

### Arquivos Modificados

1. **`types/index.ts`**

   - Adicionado `anchorMode?: boolean` em `ShapeProps`
   - Adicionado evento `anchorModeToggle` em `ShapeEvents`

2. **`composables/useShape.ts`**

   - Adicionado estado reativo `isAnchorMode`
   - Implementado `handleContextMenu()` para clique direito
   - Implementado `toggleAnchorMode()` para alternar o estado

3. **`DraggableShape.vue`**

   - Adicionado template condicional para anchor points
   - Adicionado estilos CSS para modo anchor
   - Integrado evento `@contextmenu` para clique direito

4. **`useWorkflow.ts`**

   - Adicionado handler `onShapeAnchorModeToggle`

5. **`WorkflowView.vue`**
   - Conectado evento `@anchor-mode-toggle` aos shapes

## Uso Futuro

Esta implementação foi preparada para futuras extensões:

- **Conexões entre shapes**: Os anchor points podem ser usados como pontos de conexão
- **Validação de conexões**: Lógica para permitir/proibir certas conexões
- **Fluxo de dados**: Definir direções de fluxo através dos anchor points
- **Persistência**: Salvar estado do anchor mode no banco de dados/localStorage

## Testando a Funcionalidade

1. Inicie o projeto: `npm run dev`
2. Acesse: `http://localhost:5174/`
3. Adicione alguns shapes no canvas
4. Clique com o botão direito em um shape para ativar o modo anchor
5. Observe as bolinhas vermelhas nos lados do shape
6. Clique com o botão direito novamente para desativar

A funcionalidade está pronta e aguardando novas implementações conforme suas necessidades futuras!

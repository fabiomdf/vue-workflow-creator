# Guia do Modo Anchor

## Funcionalidade Implementada

Foi implementada uma nova funcionalidade de **Modo Anchor** para os shapes no Vue Workflow Creator.

## Como Usar

### Ativando o Modo Anchor

1. **Clique com o botão direito** em qualquer shape no canvas
2. O shape automaticamente entrará no **Modo Anchor**

### Características do Modo Anchor

Quando um shape está no modo anchor:

- ✅ **Não exibe handles de redimensionamento**: Os pequenos quadrados azuis para redimensionar ficam ocultos
- ✅ **Exibe 4 bolinhas vermelhas**: Uma no centro de cada lado do shape (topo, direita, baixo, esquerda)
- ✅ **Contorno tracejado vermelho**: O shape ganha um contorno visual indicando que está no modo anchor
- ✅ **Ainda pode ser arrastado**: O shape mantém a capacidade de ser movido pelo canvas

### Desativando o Modo Anchor

Para desativar o modo anchor:

1. **Clique novamente com o botão direito** no shape que está no modo anchor
2. O shape retornará ao modo normal com handles de redimensionamento

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

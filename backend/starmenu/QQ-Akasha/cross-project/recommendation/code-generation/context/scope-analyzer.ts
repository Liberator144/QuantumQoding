/**
 * Scope analyzer for finding elements in scope at a given position
 */

import { CodeElement, CodeElementType } from './types';

/**
 * Scope analysis result
 */
export interface ScopeAnalysisResult {
  /** Current scope at the position */
  currentScope?: CodeElement;

  /** Variables in scope */
  variables: CodeElement[];

  /** Functions in scope */
  functions: CodeElement[];

  /** Classes in scope */
  classes: CodeElement[];

  /** Interfaces in scope */
  interfaces: CodeElement[];

  /** Types in scope */
  types: CodeElement[];
}

/**
 * Find elements in scope at a given position
 */
export function findElementsInScope(
  elements: CodeElement[],
  position: { line: number; column: number }
): ScopeAnalysisResult {
  // Build element hierarchy
  const elementMap = new Map<string, CodeElement>();
  const childrenMap = new Map<string, CodeElement[]>();

  for (const element of elements) {
    elementMap.set(element.id, element);

    if (element.parentId) {
      const children = childrenMap.get(element.parentId) || [];
      children.push(element);
      childrenMap.set(element.parentId, children);
    }
  }

  // Find elements that contain the position
  const containingElements = elements.filter(element => isPositionInElement(position, element));

  // Sort by nesting level (deepest first)
  containingElements.sort((a, b) => {
    const aDepth = getElementDepth(a, elementMap);
    const bDepth = getElementDepth(b, elementMap);
    return bDepth - aDepth;
  });

  // The deepest containing element is the current scope
  const currentScope = containingElements.length > 0 ? containingElements[0] : undefined;

  // Find all elements in scope
  const inScopeElements = findAllElementsInScope(elements, currentScope, elementMap, childrenMap);

  // Group elements by type
  const variables = inScopeElements.filter(e => e.type === CodeElementType.VARIABLE);
  const functions = inScopeElements.filter(
    e => e.type === CodeElementType.FUNCTION || e.type === CodeElementType.METHOD
  );
  const classes = inScopeElements.filter(e => e.type === CodeElementType.CLASS);
  const interfaces = inScopeElements.filter(e => e.type === CodeElementType.INTERFACE);
  const types = inScopeElements.filter(e => e.type === CodeElementType.TYPE);

  return {
    currentScope,
    variables,
    functions,
    classes,
    interfaces,
    types,
  };
}

/**
 * Check if a position is within an element
 */
function isPositionInElement(
  position: { line: number; column: number },
  element: CodeElement
): boolean {
  const { line, column } = position;
  const { startPosition, endPosition } = element;

  // Check if position is after start position
  if (line < startPosition.line || (line === startPosition.line && column < startPosition.column)) {
    return false;
  }

  // Check if position is before end position
  if (line > endPosition.line || (line === endPosition.line && column > endPosition.column)) {
    return false;
  }

  return true;
}

/**
 * Get the depth of an element in the hierarchy
 */
function getElementDepth(element: CodeElement, elementMap: Map<string, CodeElement>): number {
  let depth = 0;
  let current = element;

  while (current.parentId) {
    depth++;
    const parent = elementMap.get(current.parentId);
    if (!parent) break;
    current = parent;
  }

  return depth;
}

/**
 * Find all elements in scope
 */
function findAllElementsInScope(
  allElements: CodeElement[],
  currentScope: CodeElement | undefined,
  elementMap: Map<string, CodeElement>,
  childrenMap: Map<string, CodeElement[]>
): CodeElement[] {
  const inScopeElements: CodeElement[] = [];

  // If no current scope, return global elements
  if (!currentScope) {
    return allElements.filter(e => !e.parentId);
  }

  // Add elements from the current scope
  inScopeElements.push(currentScope);

  // Add child elements of the current scope
  const children = childrenMap.get(currentScope.id) || [];
  inScopeElements.push(...children);

  // Add elements from parent scopes
  let parentId = currentScope.parentId;
  while (parentId) {
    const parent = elementMap.get(parentId);
    if (!parent) break;

    inScopeElements.push(parent);

    // Add siblings of the current element that are defined before it
    const siblings = childrenMap.get(parentId) || [];
    for (const sibling of siblings) {
      if (
        sibling.id !== currentScope.id &&
        (sibling.startPosition.line < currentScope.startPosition.line ||
          (sibling.startPosition.line === currentScope.startPosition.line &&
            sibling.startPosition.column < currentScope.startPosition.column))
      ) {
        inScopeElements.push(sibling);
      }
    }

    parentId = parent.parentId;
  }

  // Add global elements
  const globalElements = allElements.filter(e => !e.parentId);
  inScopeElements.push(...globalElements);

  return inScopeElements;
}

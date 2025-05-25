/**
 * D3 Type Declarations
 * 
 * This module provides enhanced type declarations for d3 library functions
 * used in the QQ-Verse project, replacing any types with proper interfaces.
 * 
 * @version 1.0.0
 */

import * as d3 from 'd3';

declare module 'd3' {
  // Force Simulation Types
  export interface ForceNode extends d3.SimulationNodeDatum {
    id: string;
    name: string;
    type: string;
    group?: number;
    radius?: number;
    color?: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
    vx?: number;
    vy?: number;
    index?: number;
  }

  export interface ForceLink extends d3.SimulationLinkDatum<ForceNode> {
    id?: string;
    source: string | ForceNode;
    target: string | ForceNode;
    value?: number;
    distance?: number;
    strength?: number;
    type?: string;
    color?: string;
    width?: number;
    index?: number;
  }

  export interface ForceSimulation extends d3.Simulation<ForceNode, ForceLink> {
    nodes(): ForceNode[];
    nodes(nodes: ForceNode[]): this;
    force(name: string): d3.Force<ForceNode, ForceLink> | undefined;
    force(name: string, force: d3.Force<ForceNode, ForceLink> | null): this;
    alpha(): number;
    alpha(alpha: number): this;
    alphaTarget(): number;
    alphaTarget(target: number): this;
    alphaMin(): number;
    alphaMin(min: number): this;
    alphaDecay(): number;
    alphaDecay(decay: number): this;
    velocityDecay(): number;
    velocityDecay(decay: number): this;
    restart(): this;
    stop(): this;
    tick(iterations?: number): this;
    on(typenames: string, listener: (this: any, ...args: any[]) => void): this;
  }

  // Zoom Types
  export interface ZoomBehavior<Datum, Element> {
    (selection: d3.Selection<Element, Datum, any, any>): void;
    transform(selection: d3.Selection<Element, Datum, any, any>, transform: d3.ZoomTransform): this;
    translateBy(selection: d3.Selection<Element, Datum, any, any>, x: number, y: number): this;
    translateTo(selection: d3.Selection<Element, Datum, any, any>, x: number, y: number, p?: [number, number]): this;
    scaleBy(selection: d3.Selection<Element, Datum, any, any>, k: number, p?: [number, number]): this;
    scaleTo(selection: d3.Selection<Element, Datum, any, any>, k: number, p?: [number, number]): this;
    filter(filter: (event: any, d: Datum) => boolean): this;
    touchable(touchable: boolean | ((event: any, d: Datum) => boolean)): this;
    wheelDelta(delta: (event: any, d: Datum) => number): this;
    extent(extent: [[number, number], [number, number]] | ((datum: Datum, index: number, nodes: Element[] | ArrayLike<Element>) => [[number, number], [number, number]])): this;
    scaleExtent(extent: [number, number]): this;
    translateExtent(extent: [[number, number], [number, number]]): this;
    clickDistance(distance: number): this;
    duration(duration: number): this;
    interpolate(interpolate: (a: number, b: number) => (t: number) => number): this;
    on(typenames: string, listener: (this: Element, event: any, d: Datum) => void): this;
  }

  // Selection Types
  export interface Selection<GElement extends d3.BaseType, Datum, PElement extends d3.BaseType, PDatum> {
    attr(name: string, value: null): this;
    attr(name: string, value: string | number | boolean | ((datum: Datum, index: number, nodes: GElement[]) => string | number | boolean | null)): this;
    attr(name: string): string;
    
    style(name: string, value: null): this;
    style(name: string, value: string | number | ((datum: Datum, index: number, nodes: GElement[]) => string | number | null), priority?: string): this;
    style(name: string): string;
    
    property(name: string, value: null): this;
    property(name: string, value: any | ((datum: Datum, index: number, nodes: GElement[]) => any)): this;
    property(name: string): any;
    
    classed(names: string, value: boolean | ((datum: Datum, index: number, nodes: GElement[]) => boolean)): this;
    classed(names: string): boolean;
    
    text(value: null): this;
    text(value: string | number | boolean | ((datum: Datum, index: number, nodes: GElement[]) => string | number | boolean | null)): this;
    text(): string;
    
    html(value: null): this;
    html(value: string | ((datum: Datum, index: number, nodes: GElement[]) => string | null)): this;
    html(): string;
    
    append<ChildElement extends d3.BaseType>(type: string): d3.Selection<ChildElement, Datum, PElement, PDatum>;
    append<ChildElement extends d3.BaseType>(creator: (datum: Datum, index: number, nodes: GElement[]) => ChildElement): d3.Selection<ChildElement, Datum, PElement, PDatum>;
    
    insert<ChildElement extends d3.BaseType>(type: string, before?: string | ((datum: Datum, index: number, nodes: GElement[]) => Element | null)): d3.Selection<ChildElement, Datum, PElement, PDatum>;
    insert<ChildElement extends d3.BaseType>(creator: (datum: Datum, index: number, nodes: GElement[]) => ChildElement, before?: string | ((datum: Datum, index: number, nodes: GElement[]) => Element | null)): d3.Selection<ChildElement, Datum, PElement, PDatum>;
    
    remove(): this;
    
    data<NewDatum>(data: NewDatum[], key?: (datum: NewDatum | Datum, index: number, nodes: (NewDatum | Datum)[]) => string): d3.Selection<GElement, NewDatum, PElement, PDatum>;
    data(): Datum[];
    
    join<ChildElement extends d3.BaseType, NewDatum>(
      enter: (enter: d3.Selection<null, NewDatum, PElement, PDatum>) => d3.Selection<ChildElement, NewDatum, PElement, PDatum>,
      update?: (update: d3.Selection<GElement, NewDatum, PElement, PDatum>) => d3.Selection<GElement, NewDatum, PElement, PDatum>,
      exit?: (exit: d3.Selection<GElement, Datum, PElement, PDatum>) => d3.Selection<GElement, Datum, PElement, PDatum>
    ): d3.Selection<GElement | ChildElement, NewDatum, PElement, PDatum>;
    
    on(typenames: string, listener: (this: GElement, event: any, d: Datum) => void, options?: boolean | AddEventListenerOptions): this;
    on(typenames: string): (d: Datum, i: number, nodes: GElement[]) => void;
    
    dispatch(type: string, parameters?: (datum: Datum, index: number, nodes: GElement[]) => any): this;
    dispatch(type: string, parameters?: any): this;
    
    call(callback: (selection: this, ...args: any[]) => void, ...args: any[]): this;
    
    nodes(): GElement[];
    node(): GElement | null;
    
    size(): number;
    
    empty(): boolean;
    
    each(callback: (datum: Datum, index: number, nodes: GElement[]) => void): this;
    
    filter(filter: string | ((datum: Datum, index: number, nodes: GElement[]) => boolean)): d3.Selection<GElement, Datum, PElement, PDatum>;
    
    select<DescElement extends d3.BaseType>(selector: string | ((datum: Datum, index: number, nodes: GElement[]) => DescElement | null)): d3.Selection<DescElement, Datum, PElement, PDatum>;
    
    selectAll<DescElement extends d3.BaseType, NewDatum>(selector: string | ((datum: Datum, index: number, nodes: GElement[]) => DescElement[] | d3.ArrayLike<DescElement>)): d3.Selection<DescElement, NewDatum, GElement, Datum>;
    
    transition(name?: string): d3.Transition<GElement, Datum, PElement, PDatum>;
  }

  // Scale Types
  export interface ScaleLinear<Range> {
    (value: number | { valueOf(): number }): Range;
    domain(): number[];
    domain(domain: Array<number | { valueOf(): number }>): this;
    range(): Range[];
    range(range: Range[]): this;
    rangeRound(range: Array<number | { valueOf(): number }>): this;
    clamp(): boolean;
    clamp(clamp: boolean): this;
    interpolate(): d3.InterpolatorFactory<any, any>;
    interpolate(interpolate: d3.InterpolatorFactory<any, any>): this;
    ticks(count?: number): number[];
    tickFormat(count?: number, specifier?: string): (d: number | { valueOf(): number }) => string;
    nice(count?: number): this;
    copy(): d3.ScaleLinear<Range>;
    unknown(): Range;
    unknown(value: Range): this;
  }

  export interface ScaleOrdinal<Range, Domain extends { toString(): string } = string> {
    (domain: Domain): Range;
    domain(): Domain[];
    domain(domain: Domain[]): this;
    range(): Range[];
    range(range: Range[]): this;
    unknown(): Range;
    unknown(value: Range): this;
    copy(): d3.ScaleOrdinal<Range, Domain>;
  }

  // Axis Types
  export interface Axis<Domain> {
    (context: d3.Selection<SVGGElement, any, any, any>): void;
    scale(): any;
    scale(scale: any): this;
    ticks(...args: any[]): this;
    tickArguments(): any[];
    tickArguments(args: any[]): this;
    tickValues(): any[] | null;
    tickValues(values: any[] | null): this;
    tickFormat(): ((d: any) => string) | null;
    tickFormat(format: ((d: any) => string) | null): this;
    tickSize(): number;
    tickSize(size: number): this;
    tickSizeInner(): number;
    tickSizeInner(size: number): this;
    tickSizeOuter(): number;
    tickSizeOuter(size: number): this;
    tickPadding(): number;
    tickPadding(padding: number): this;
  }

  // Color Types
  export interface ColorScale extends d3.ScaleOrdinal<string, string> {
    domain(): string[];
    domain(domain: string[]): this;
    range(): string[];
    range(range: string[]): this;
    unknown(): string;
    unknown(value: string): this;
    copy(): d3.ColorScale;
  }

  // Drag Types
  export interface DragBehavior<Element, Datum, Subject> {
    (selection: d3.Selection<Element, Datum, any, any>): void;
    container(container: ((this: Element, d: Datum, i: number, nodes: Element[]) => Element | SVGSVGElement | HTMLElement | null) | Element | SVGSVGElement | HTMLElement | null): this;
    filter(filter: ((this: Element, d: Datum, i: number, nodes: Element[]) => boolean) | boolean): this;
    touchable(touchable: ((this: Element, d: Datum, i: number, nodes: Element[]) => boolean) | boolean): this;
    subject(subject: ((this: Element, d: Datum, i: number, nodes: Element[]) => Subject | d3.SubjectPosition) | Subject | d3.SubjectPosition): this;
    clickDistance(distance: number): this;
    on(typenames: string, listener: (this: Element, event: any, d: Datum) => void): this;
  }
}
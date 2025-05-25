/**
 * Type declarations for d3 library version 7.x
 */

declare namespace d3 {
  // SELECTIONS
  function select(selector: string | Node): Selection<any, any, any, any>;
  function selectAll(selector: string | Node[]): Selection<any, any, any, any>;

  // SCALES
  function scaleTime(): ScaleTime<number, number>;
  function scaleLinear(): ScaleLinear<number, number>;

  // AXES
  function axisBottom<Domain>(scale: Scale<Domain, number>): Axis<Domain>;
  function axisLeft<Domain>(scale: Scale<Domain, number>): Axis<Domain>;

  // TIME FORMATTING
  function timeFormat(specifier: string): (date: Date | number) => string;

  // GENERATORS
  function line<Datum>(): Line<Datum>;
  function area<Datum>(): Area<Datum>;

  // CURVES
  const curveLinear: CurveFactory;
  const curveStep: CurveFactory;
  const curveCardinal: CurveFactory;
  const curveMonotoneX: CurveFactory;

  // DATA UTILITIES
  function extent<Datum, Value extends Numeric>(
    data: Iterable<Datum>,
    accessor: (datum: Datum, index: number, array: Iterable<Datum>) => Value
  ): [Value, Value];

  function min<Datum, Value extends Numeric>(
    data: Iterable<Datum>,
    accessor: (datum: Datum, index: number, array: Iterable<Datum>) => Value
  ): Value | undefined;

  function max<Datum, Value extends Numeric>(
    data: Iterable<Datum>,
    accessor: (datum: Datum, index: number, array: Iterable<Datum>) => Value
  ): Value | undefined;

  // FORCES
  function forceSimulation<NodeDatum>(
    nodes?: NodeDatum[]
  ): Simulation<NodeDatum, undefined>;

  function forceLink<NodeDatum, LinkDatum>(
    links?: LinkDatum[]
  ): Link<NodeDatum, LinkDatum>;

  function forceManyBody<NodeDatum>(): ManyBody<NodeDatum>;

  function forceCenter<NodeDatum>(
    x: number,
    y: number
  ): Center<NodeDatum>;

  function forceCollide<NodeDatum>(
    radius: number | ((d: NodeDatum) => number)
  ): Collide<NodeDatum>;

  // ZOOM
  function zoom<Datum>(): Zoom<Element, Datum>;

  // DRAG
  function drag<Element, Datum, Subject>(): Drag<Element, Datum, Subject>;

  // INTERFACES
  interface Selection<GElement extends Element, Datum, PElement extends Element, PDatum> {
    append(type: string): Selection<Element, Datum, PElement, PDatum>;
    attr(name: string, value: any): Selection<GElement, Datum, PElement, PDatum>;
    style(name: string, value: any): Selection<GElement, Datum, PElement, PDatum>;
    text(value: string | ((d: Datum, i: number) => string)): Selection<GElement, Datum, PElement, PDatum>;
    append<Type extends Element>(type: string): Selection<Type, Datum, PElement, PDatum>;
    data<NewDatum>(data: NewDatum[]): Selection<GElement, NewDatum, PElement, PDatum>;
    enter(): Selection<GElement, Datum, PElement, PDatum>;
    exit(): Selection<GElement, Datum, PElement, PDatum>;
    merge(other: Selection<GElement, Datum, PElement, PDatum>): Selection<GElement, Datum, PElement, PDatum>;
    transition(): Transition<GElement, Datum, PElement, PDatum>;
    call(fn: (selection: Selection<GElement, Datum, PElement, PDatum>, ...args: any[]) => void, ...args: any[]): Selection<GElement, Datum, PElement, PDatum>;
    on(type: string, listener: (event: any, d: Datum) => void): Selection<GElement, Datum, PElement, PDatum>;
    selectAll(selector: string): Selection<Element, any, GElement, Datum>;
    filter(filter: (d: Datum, i: number) => boolean): Selection<GElement, Datum, PElement, PDatum>;
    select(selector: string): Selection<Element, Datum, PElement, PDatum>;
    html(value: string | ((d: Datum, i: number) => string)): Selection<GElement, Datum, PElement, PDatum>;
  }

  interface Transition<GElement extends Element, Datum, PElement extends Element, PDatum> {
    attr(name: string, value: any): Transition<GElement, Datum, PElement, PDatum>;
    style(name: string, value: any): Transition<GElement, Datum, PElement, PDatum>;
    duration(milliseconds: number): Transition<GElement, Datum, PElement, PDatum>;
    call(fn: (transition: Transition<GElement, Datum, PElement, PDatum>, ...args: any[]) => void, ...args: any[]): Transition<GElement, Datum, PElement, PDatum>;
  }

  interface Scale<Domain, Range> {
    (value: Domain): Range;
    domain(domain: Domain[]): this;
    range(range: Range[]): this;
  }

  interface ScaleTime<Range, Output> extends Scale<Date, Range> {
    domain(domain: Date[]): this;
    range(range: Range[]): this;
  }

  interface ScaleLinear<Range, Output> extends Scale<number, Range> {
    domain(domain: number[]): this;
    range(range: Range[]): this;
  }

  interface Axis<Domain> {
    (selection: Selection<any, any, any, any>): void;
    scale(scale: Scale<Domain, number>): this;
    tickFormat(format: (d: Domain) => string): this;
    tickSize(size: number): this;
    ticks(count: number): this;
  }

  interface Line<Datum> {
    (data: Datum[]): string | null;
    x(accessor: (d: Datum, i: number) => number): this;
    y(accessor: (d: Datum, i: number) => number): this;
    curve(curve: CurveFactory): this;
  }

  interface Area<Datum> {
    (data: Datum[]): string | null;
    x(accessor: (d: Datum, i: number) => number): this;
    y0(accessor: (d: Datum, i: number) => number): this;
    y1(accessor: (d: Datum, i: number) => number): this;
    curve(curve: CurveFactory): this;
  }

  interface CurveFactory {
    (context: any): Curve;
  }

  interface Curve {
    lineStart(): void;
    lineEnd(): void;
    point(x: number, y: number): void;
  }

  interface Simulation<NodeDatum, LinkDatum> {
    nodes(nodes: NodeDatum[]): this;
    alpha(alpha: number): this;
    alphaTarget(target: number): this;
    restart(): this;
    stop(): this;
    tick(): this;
    on(typenames: string, listener: (event: any) => void): this;
    force(name: string, force: Force<NodeDatum>): this;
  }

  interface Force<NodeDatum> {
    (alpha: number): void;
    initialize(nodes: NodeDatum[]): void;
  }

  interface Link<NodeDatum, LinkDatum> extends Force<NodeDatum> {
    id(id: (node: NodeDatum) => string): this;
    distance(distance: number | ((link: LinkDatum, i: number, links: LinkDatum[]) => number)): this;
    links(links: LinkDatum[]): this;
  }

  interface ManyBody<NodeDatum> extends Force<NodeDatum> {
    strength(strength: number | ((d: NodeDatum, i: number) => number)): this;
  }

  interface Center<NodeDatum> extends Force<NodeDatum> {
    x(x: number): this;
    y(y: number): this;
  }

  interface Collide<NodeDatum> extends Force<NodeDatum> {
    radius(radius: number | ((d: NodeDatum) => number)): this;
  }

  interface Zoom<Element, Datum> {
    scaleExtent(extent: [number, number]): this;
    extent(extent: [[number, number], [number, number]]): this;
    on(typenames: string, listener: (event: any) => void): this;
    transform(selection: Selection<Element, Datum, any, any>, transform: any): this;
  }

  interface Drag<Element, Datum, Subject> {
    on(typenames: string, listener: (event: any, d: Subject) => void): this;
  }

  // Type for numeric values
  type Numeric = number | { valueOf(): number };
}

declare const d3: typeof d3;
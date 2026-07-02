declare module "@svg-maps/japan" {
  export type SvgMapLocation = {
    id: string;
    name: string;
    path: string;
  };
  export type SvgMap = {
    label: string;
    viewBox: string;
    locations: SvgMapLocation[];
  };
  const map: SvgMap;
  export default map;
}

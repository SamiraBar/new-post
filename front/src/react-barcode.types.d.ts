declare module 'react-barcode' {
  import { ComponentType } from 'react';

  interface BarcodeProps {
    value: string;
    width?: number;
    height?: number;
    displayValue?: boolean;
    fontSize?: number;
    background?: string;
    lineColor?: string;
    margin?: number;
  }

  const Barcode: ComponentType<BarcodeProps>;
  export default Barcode;
}

/// <reference types="next" />
/// <reference types="next/types/global" />

declare module 'next/app' {
  export type AppProps = {
    Component: React.ComponentType;
    pageProps: any;
  };
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// Add support for importing images
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
} 
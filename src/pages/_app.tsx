import "@/styles/globals.css";
import "@/styles/fog.css";
import "@/styles/flare-effect.css";
import "@/styles/rain-effect.css";
import type { AppProps } from "next/app";
import { useViewportSize } from '@mantine/hooks';

export default function App({ Component, pageProps }: AppProps) {
  const { height, width } = useViewportSize();
  return (
    <Component
      {...pageProps}
      height={height}
      width={width}
    />
  );
}

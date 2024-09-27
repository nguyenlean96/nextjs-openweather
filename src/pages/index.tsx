import WeatherProvider from "@/context/WeatherDataProvider";
import { Main, SearchPanel } from "@/components";

export default function Home({ width, height, props }: { width: number; height: number; props: any }) {
  return (
    <WeatherProvider>
      <div className="grid grid-cols-4">
        <SearchPanel
          width={width}
          height={height}
        />
        <Main />
      </div>
    </WeatherProvider>
  );
}

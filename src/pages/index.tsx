import WeatherProvider from "@/context/WeatherDataProvider";
import { Main, SearchPanel, DebugPanel } from "@/components";

export default function Home({ width, height, props }: { width: number; height: number; props: any }) {
  return (
    <WeatherProvider>
      <div className="relative w-screen h-screen overflow-hidden">
        <div className="grid grid-cols-4">
          <SearchPanel
            width={width}
            height={height}
          />
          <div className="col-span-3">
            <Main
              width={width}
              height={height}
            />
          </div>
        </div>
        <DebugPanel
          width={width}
          height={height}
        />
      </div>
    </WeatherProvider>
  );
}

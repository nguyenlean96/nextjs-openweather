import WeatherProvider from "@/context/WeatherDataProvider";
import { Main, SearchPanel, DebugPanel } from "@/components";

export default function Home({ width, height, props }: { width: number; height: number; props: any }) {
  return (
    <WeatherProvider>
      <div className="relative w-screen h-screen overflow-hidden">
        <div className="flex flex-col relative md:grid md:grid-cols-5 lg:grid-cols-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 right-0 z-40 md:relative md:z-0 md:col-span-2 lg:col-span-1 md:h-full">
            <SearchPanel
              width={width}
              height={height}
            />
          </div>
          <div className="md:col-span-3">
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

import WeatherProvider from "@/context/WeatherDataProvider";
import { Main } from "@/components";

export default function Home() {
  
  return (
    <WeatherProvider>
      <Main />
    </WeatherProvider>
  );
}

import { Catalog } from "./catalog/Catalog";
import { StressView } from "./catalog/StressView";
import { initialTheme } from "./catalog/theme";

const view = new URLSearchParams(location.search).get("view");

function App() {
  return view === "stress" ? <StressView /> : <Catalog initial={initialTheme()} />;
}

export default App;

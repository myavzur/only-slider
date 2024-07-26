import { PageLayout } from "@/components/page-layout";
import { TimelapseSlider } from "@/components/timelapse-slider";

import { Slider } from "../timelapse-slider/ui/slider";
import { historicalTimelapses } from "./data";

export const App = () => {
	return (
		<PageLayout>
			<TimelapseSlider
				title="Исторические даты"
				timelapses={historicalTimelapses}
				defaultSelected={historicalTimelapses[2]}
			/>

			<TimelapseSlider
				title="Запоминающиеся даты"
				timelapses={historicalTimelapses.slice(0, 3)}
				defaultSelected={historicalTimelapses[0]}
			/>

			<TimelapseSlider
				title="Очередные даты"
				timelapses={historicalTimelapses.slice(0, 2)}
				defaultSelected={historicalTimelapses[0]}
			/>
		</PageLayout>
	);
};

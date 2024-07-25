import { PageLayout } from "@/components/page-layout";
import { TimelapseSlider } from "@/components/timelapse-slider";

import { Slider } from "../slider";
import { historicalTimelapses } from "./data";

export const App = () => {
	return (
		<PageLayout>
			<TimelapseSlider
				title="Исторические даты"
				timelapses={historicalTimelapses}
				defaultSelected={historicalTimelapses[4]}
			/>

			<TimelapseSlider
				title="Запоминающиеся даты"
				timelapses={historicalTimelapses}
				defaultSelected={historicalTimelapses[4]}
			/>

			<TimelapseSlider
				title="Необычные даты"
				timelapses={historicalTimelapses}
				defaultSelected={historicalTimelapses[4]}
			/>
		</PageLayout>
	);
};

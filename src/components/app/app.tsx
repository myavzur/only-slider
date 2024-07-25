
import { PageLayout } from "@/components/page-layout";
import { TimelapseSlider } from "@/components/timelapse-slider";
import { historicalTimelapses } from "./data";

export const App = () => {
	return (
		<PageLayout>
			<TimelapseSlider title="Исторические даты" timelapses={historicalTimelapses} />
		</PageLayout>
	);
};

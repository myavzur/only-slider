import { FC } from "react";

import { PageLayoutProps } from "./props.interface";
import styles from "./styles.module.scss";

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
	return (
		<main className={styles.page}>
			<div className={styles.page__spacer} />

			<div className={styles.page__container}>{children}</div>

			<div className={styles.page__spacer} />
		</main>
	);
};

import { FC } from "react";

import { PageTitleProps } from "./props.interface";
import styles from "./styles.module.scss";

export const PageTitle: FC<PageTitleProps> = ({ children }) => {
	return (
		<div className={styles.title}>
			<h1 className={styles.heading}>{children}</h1>
		</div>
	);
};
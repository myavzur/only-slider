import { FC } from "react";

import { PageContainerProps } from "./props.interface";
import styles from "./styles.module.scss";

export const PageContainer: FC<PageContainerProps> = ({ children }) => {
	return (
		<div className={styles.container}>
			{children}
		</div>
	);
};
import cn from "classnames";
import { FC } from "react";

import { PageTitleProps } from "./props.interface";
import styles from "./styles.module.scss";

export const PageTitle: FC<PageTitleProps> = ({ children, className }) => {
	return (
		<div className={cn(styles.title, className)}>
			<h1 className={styles.heading}>{children}</h1>
		</div>
	);
};

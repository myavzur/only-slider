import cn from "classnames";
import { FC, useState } from "react";

import { PaginationProps } from "./props.interface";
import styles from "./styles.module.scss";

export const Pagination: FC<PaginationProps> = ({
	pages,
	onClick,
	selectedIndex
}) => {
	return (
		<div className={styles.pagination}>
			{[...Array(pages)].map((_, index) => {
				const isActive = index === selectedIndex;

				return (
					<button
						key={index}
						className={cn(styles.pagination__dot, {
							[styles.pagination__dot_active]: isActive
						})}
						onClick={() => onClick(index)}
					/>
				);
			})}
		</div>
	);
};

import { FC } from "react";
import { EventSlideProps } from "./props.interface";
import styles from "./styles.module.scss";

export const EventSlide: FC<EventSlideProps> = ({ event }) => {
	return (
		<div
			className={styles.event}
		>
			<h3 className={styles.event__date}>{event.date}</h3>
			<p className={styles.event__text}>{event.text}</p>
		</div>
	);
}
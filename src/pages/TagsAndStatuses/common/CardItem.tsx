import type { FC, ReactNode } from "react";
import { memo } from "react";
import { useDrag, useDrop } from "react-dnd";

export const ItemTypes = {
  CARD: "card",
};

export interface CardProps {
  id: string;
  text: string;
  moveCard: (id: string, to: number) => void;
  findCard: (id: string) => { index: number };
  children: ReactNode;
}

interface Item {
  id: string;
  originalIndex: number;
}

const CardItem: FC<CardProps> = memo(function Card({
  id,
  moveCard,
  findCard,
  children,
}) {
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { id, originalIndex },
      collect: (monitor: { isDragging: () => any }) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (
        item: { id: any; originalIndex: any },
        monitor: { didDrop: () => any }
      ) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, moveCard]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      hover({ id: draggedId }: Item) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id);
          moveCard(draggedId, overIndex);
        }
      },
    }),
    [findCard, moveCard]
  );

  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity }}>
      {children}
    </div>
  );
});

export default CardItem;

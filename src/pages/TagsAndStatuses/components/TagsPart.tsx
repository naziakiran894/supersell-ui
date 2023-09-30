import React, { useCallback } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { nanoid } from "nanoid";
import { IInitalValues } from "../index";
import update from "immutability-helper";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../common/CardItem";
import CardItem from "../common/CardItem";
import TagsItemComponent from "../common/TagsDragitem";
import Translations from "../../../@core/layouts/Translations";

export type IProps = {
  formItems: IInitalValues[];
  setFormItems: any;
};

const TagsFields = ({ formItems, setFormItems }: IProps) => {
  const theme = useTheme();

  const findCard = useCallback(
    (order: string) => {
      const card = formItems.filter((c) => `${c?.id}` === order)[0];
      return {
        card,
        index: formItems.indexOf(card),
      };
    },
    [formItems]
  );

  const moveCard = useCallback(
    (id: string, atIndex: number) => {
      const { card, index } = findCard(id);
      setFormItems(
        update(formItems, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        })
      );
    },
    [findCard, formItems, setFormItems]
  );

  const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }));

  return (
    <Box m={5}>
      <Typography
        variant="body1"
        sx={{ fontSize: "16px", fontWeight: 500, color: "black" }}
      >
        <Translations text="TAGS" />
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "20px",
          gap: "10px",
        }}
        ref={drop}
      >
        {formItems.map((item, index) => (
          <CardItem
            key={item?.id}
            id={item?.id?.toString()}
            text={item?.id?.toString()}
            moveCard={moveCard}
            findCard={findCard}
          >
            <TagsItemComponent
              index={index}
              tags={formItems}
              setTags={setFormItems}
              data={item}
            />
          </CardItem>
        ))}
      </Box>
    </Box>
  );
};

export default TagsFields;

import React, { useCallback } from "react";
import { Box, Card, Typography, IconButton, useTheme } from "@mui/material";
import Icon from "../../../../@core/components/icon/index";
import { FormItem } from "../../index";

import update from "immutability-helper";
import { useDrop } from "react-dnd";

// import { ItemTypes } from "./Card";
import { ItemTypes } from "../common/CardItem";
import CardItem from "../common/CardItem";
import FormItemComponent from "../common/Dragitem";
import { useTranslation } from "react-i18next";
import Translations from "../../../../@core/layouts/Translations";

export type IProps = {
  formItems: FormItem[];
  setFormItems: any;
};

const AboutFields = ({ formItems, setFormItems }: IProps) => {
  const theme = useTheme();
  const findCard = useCallback(
    (order: string) => {
      const card = formItems.filter(
        (c) => `${c.order}` === order
      )[0] as FormItem;
      return {
        card,
        index: formItems.indexOf(card),
      };
    },
    [formItems]
  );
  const { t } = useTranslation();

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

  const handleToggleVisibility = (itemId: number) => {
    setFormItems((prevItems: any) =>
      //@ts-ignore
      prevItems.map((item) => {
        if (item.order === itemId) {
          return { ...item, visible: !item.visible };
        }
        return item;
      })
    );
  };

  const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }));

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ my: 5 }}>
        <Translations text="CONTACT" />
      </Typography>
      <Box
        sx={{
          maxWidth: "550px",
          display: "flex",
          flexDirection: "column",
          rowGap: 2,
          [theme.breakpoints.down("md")]: {
            maxWidth: "100%",
          },
        }}
        ref={drop}
      >
        {formItems.map((item) => (
          <CardItem
            key={item.order}
            id={`${item.order}`}
            text={item.keyName}
            moveCard={moveCard}
            findCard={findCard}
          >
            <FormItemComponent
              order={item.order}
              keyName={item.value}
              visible={item.visible}
              onToggleVisibility={() => handleToggleVisibility(item.order)}
            />
          </CardItem>
        ))}
      </Box>
    </Box>
  );
};

export default AboutFields;

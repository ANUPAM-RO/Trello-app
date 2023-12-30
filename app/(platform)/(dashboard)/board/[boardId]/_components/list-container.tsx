"use client";

import { useEffect, useState } from "react";
import { DragDropContext , Droppable } from "@hello-pangea/dnd"

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";

import { ListItem } from "./list-item";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderData, setOrderData] = useState(data);

  const { execute : executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: (data) => {
      toast.success("List reordered")
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute : executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: (data) => {
      toast.success("card reordered")
    },
    onError: (error) => {
      toast.error(error);
    },
  });
   
  useEffect(() => {
    setOrderData(data)
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;
    if (!destination) {
      return;
    }

    //if dropped in the same position

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // user moves a list
    if (type === "list") {
      const items = reorder(
        orderData,
        source.index,
        destination.index
      ).map((item, index) => ({ ...item, order: index }));

      setOrderData(items);

      executeUpdateListOrder({ items , boardId})

    }

    // User moves a card

    if (type === "card") {
      let newOrderedData = [...orderData];

      // source and distination list
      const sourceList = newOrderedData.find(list => list.id === source.droppableId);
      const destinationList = newOrderedData.find(list => list.id === destination.droppableId);

      if (!sourceList || !destinationList) {
        return;
      }

      // Check if cards exits on the sourceList
      if (!sourceList.cards) {
        sourceList.cards = []
      }
      // Check if cards exits on the destinationList

      if (!destinationList.cards) {
        destinationList.cards = []
      }

      // Moving the card in the same list

      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards;

        setOrderData(newOrderedData);

        executeUpdateCardOrder({ boardId: boardId , items: reorderedCards})
        //User moves the card to another list 
      } else {
        // Remove card from source list

        const [movedCard] = sourceList.cards.splice(source.index, 1);
        
        //Assign the new list to the moved card 
        movedCard.listId = destination.droppableId;

        // Add the card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index
        });

        // Update the order for each card in ther destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index
        });

        setOrderData(newOrderedData);
       executeUpdateCardOrder({ boardId: boardId , items: destinationList.cards})


      }
    }   
}

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided)=>(
    <ol {...provided.droppableProps} ref={provided.innerRef} className="flex gap-x-3 h-full">
      {orderData?.map((list, index) => {
        return (
          <ListItem
            key={list.id}
            index={index}
            data={list}
          />
        )
      })}
            {provided.placeholder}
      <ListForm />
      <div className="flex-shrink-0 w-1"></div>
          </ol>
          )}
        </Droppable>
      </DragDropContext>
  );
};

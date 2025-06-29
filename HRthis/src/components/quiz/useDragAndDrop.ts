import { useState, useCallback } from 'react';

export const useDragAndDrop = () => {
  const [draggedItems, setDraggedItems] = useState<string[]>([]);
  const [dropZones, setDropZones] = useState<(string | null)[]>([]);

  const initializeSorting = useCallback((options: string[]) => {
    setDraggedItems([...options].sort(() => Math.random() - 0.5));
    setDropZones([]);
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const draggedItem = e.dataTransfer.getData('text/plain');
    
    const newDropZones = [...dropZones];
    newDropZones[dropIndex] = draggedItem;
    setDropZones(newDropZones);
    
    const newDraggedItems = draggedItems.filter(item => item !== draggedItem);
    setDraggedItems(newDraggedItems);
    
    return newDropZones;
  }, [draggedItems, dropZones]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return {
    draggedItems,
    dropZones,
    initializeSorting,
    handleDragStart,
    handleDrop,
    handleDragOver
  };
};
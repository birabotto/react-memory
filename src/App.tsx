import { useEffect, useState } from "react";
import * as C from "./App.styles";
import logoImage from "./assets/proxy_form.png";
import RestartIcon from "./svgs/restart.svg";
import { Button } from "./components/Button";
import { InfoItem } from "./components/InfoItem";
import { GridItemType } from "./types/GridItemType";
import { items } from "./data/items";
import { GridItem } from "./components/GridItem";
import { formatTimeElapsed } from "./helpers/formatTimeElapsed";

function App() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setmoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []);
  useEffect(() => {
    if (
      moveCount > 0 &&
      gridItems.every((item) => item.permanentShown === true)
    ) {
      setPlaying(false);
    }
  }, [moveCount, gridItems]);
  useEffect(() => {
    if (shownCount === 2) {
      const opened = gridItems.filter((item) => item.shown === true);
      if (opened.length === 2) {
        if (opened[0].item === opened[1].item) {
          const tmpGrid = [...gridItems];
          for (const i in tmpGrid) {
            if (tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShownCount(0);
        } else {
          setTimeout(() => {
            const tmpGrid = [...gridItems];
            for (const i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShownCount(0);
          }, 1000);
        }
        setmoveCount((moveCount) => moveCount + 1);
      }
    }
  }, [shownCount, gridItems]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) {
        setTimeElapsed(timeElapsed + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);
  const handleItemClick = (index: number) => {
    if (playing && index !== null && shownCount < 2) {
      const tmpGrid = [...gridItems];
      if (
        tmpGrid[index].permanentShown === false &&
        tmpGrid[index].shown === false
      ) {
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }
      setGridItems(tmpGrid);
    }
  };
  const resetAndCreateGrid = () => {
    setTimeElapsed(0);
    setmoveCount(0);
    setShownCount(0);
    const tmpGrid: GridItemType[] = [];
    for (let i = 0; i < items.length * 2; i++) {
      tmpGrid.push({
        item: null,
        shown: false,
        permanentShown: false,
      });
    }

    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1;
        while (pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }

        tmpGrid[pos].item = i;
      }
    }

    setGridItems(tmpGrid);

    setPlaying(true);
  };
  return (
    <C.Container>
      <C.Info>
        <C.LogoLink>
          <img src={logoImage} width={200} alt="" />
        </C.LogoLink>
        <C.InforArea>
          <InfoItem label="Time" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Moves" value={moveCount.toString()} />
        </C.InforArea>
        <Button
          label="Restart"
          icon={RestartIcon}
          onClick={resetAndCreateGrid}
        />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App;

import React, {
  FunctionComponent,
  Context,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react';

interface LayoutContextContent {
  leftMenuClosed: boolean;
  setLeftMenuClosed: (leftMenuClosed: boolean) => void;
  leftMenuDisplayed: boolean;
  setLeftMenuDisplayed: (leftMenuDisplayed: boolean) => void;
  headerDisplayed: boolean;
  setHeaderDisplayed: (headerDisplayed: boolean) => void;
}

const LayoutContext: Context<LayoutContextContent> = createContext<any>({});

type LayoutProviderProps = {

}

export const LayoutProvider: FunctionComponent<LayoutProviderProps> = ({
  children
}) => {
  const [ leftMenuClosed, setLeftMenuClosed ] = useState(false);
  const [ leftMenuDisplayed, setLeftMenuDisplayed ] = useState(true);
  const [ headerDisplayed, setHeaderDisplayed ] = useState(true);

  const value = useMemo(
    () => ({
      leftMenuClosed,
      setLeftMenuClosed,
      leftMenuDisplayed,
      setLeftMenuDisplayed,
      headerDisplayed,
      setHeaderDisplayed
    }),
    [
      leftMenuClosed,
      setLeftMenuClosed,
      leftMenuDisplayed,
      setLeftMenuDisplayed,
      headerDisplayed,
      setHeaderDisplayed
    ]
  );

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const { leftMenuClosed, headerDisplayed, leftMenuDisplayed } = useContext(LayoutContext);
  return { leftMenuClosed, headerDisplayed, leftMenuDisplayed };
}

export function useSetLayout() {
  const { setLeftMenuClosed, setHeaderDisplayed, setLeftMenuDisplayed } = useContext(LayoutContext);
  return { setLeftMenuClosed, setHeaderDisplayed, setLeftMenuDisplayed };
}

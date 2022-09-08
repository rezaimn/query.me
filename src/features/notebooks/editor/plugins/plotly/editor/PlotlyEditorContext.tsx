import React, { FunctionComponent, createContext, useContext, useMemo } from 'react';

interface PlotlyEditorContextContent {
  dataSources: any;
}
  
export const PlotlyEditorContext = createContext<PlotlyEditorContextContent>({ dataSources: [] });

interface PlotlyEditorProps {
  dataSources: any;
}
  
export const PlotlyEditorProvider: FunctionComponent<PlotlyEditorProps> = ({
  children, dataSources
}) => {
  const value = useMemo(
    () => ({
      dataSources
    }),
    [
      dataSources
    ]
  );
    
  return (
    <PlotlyEditorContext.Provider value={value}>
      {children}
    </PlotlyEditorContext.Provider>
  )
}

export const useDataSources = () => {
  const { dataSources } = useContext(PlotlyEditorContext);
  return dataSources;
}

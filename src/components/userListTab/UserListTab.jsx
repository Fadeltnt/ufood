import React from "react";
import styled, { css } from "styled-components";

const TabsWrap = styled.div`
  border-top: 1px solid var(--ins-border-primary);
  display: flex;
  justify-content: center;
  background: var(--ins-background-primary);
  @media only screen and (max-width: 735px) {
    justify-content: space-around;
    height: 44px;
    align-items: center;
    border-top: 1px solid var(--ins-border-primary);
  }
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  height: 52px;
  color: var(--ins-content-primary);

  ${({ active }) =>
  active &&
  css`
      border-top: 1px solid var(--ins-content-secondary);
      margin-top: -1px;
      color: var(--ins-content-secondary);
      color: red;
      @media only screen and (max-width: 735px) {
        border-top: none;
      }
    `}
`;
const Span = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--ins-mono-700);
  margin-left: 6px;
`;

export function TabItem({ active, label, onClick }) {
  return (
    <Wrap active={active ? "true" : undefined} onClick={onClick}>
      <Span>{label}</Span>
    </Wrap>
  );
}

TabItem.defaultProps = {
  active: false,
  label: "Visited"
};


export function Tabs({ favoriteLists, onTabSelect }) {
  const handleTabClick = (label) => {
    console.log("Tab clicked:", label);
  };
  return (
    <TabsWrap>
      {favoriteLists.map((list, index) => (
        <TabItem key={index} label={list.name} onClick={() => onTabSelect(list.id)} />
      ))}
    </TabsWrap>
  );
}
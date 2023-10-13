"use client";

import React, { Dispatch, createContext, useReducer } from "react";
import { Slide } from "@/components/slider/types";
import { Article } from "@/components/article/types";

type ArticleSections = {
  section1?: Article,
  section2?: Article,
  section3?: Article
}

type ComponentProps = {
    index: number,
    title?: string,
    slide?: Slide,
    articles?: ArticleSections,
    context?: Slide | Article,
    meta?: any
}

type ActionType = {
  type: string;
  payload: ComponentProps
};

const initialState: ComponentProps = {
    index: 0,
    context: null,
    title: "",
    slide: null,
    articles: {
      section1: null,
      section2: null,
      section3: null
    },
    meta: null
};

const reducer = (state: ComponentProps, action?: ActionType) => {
  switch (action.type) {
    case "SWITCH_INDEX":
      return {...state, index: action.payload.index, title: action.payload.title, meta: action.payload.meta, slide: null}
    case "SWITCH_SLIDE":
      return { ...state, slide: action.payload.slide};
    case "SWITCH_ARTICLE_1":
      return {
        ...state,
        articles: {...state.articles, section1: action.payload.articles.section1},
        title: action.payload.title, index: action.payload.index
      }
      case "SWITCH_ARTICLE_2":
        return {
          ...state,
          articles: {...state.articles, section2: action.payload.articles.section2},
          title: action.payload.title, index: action.payload.index
        }
        case "SWITCH_ARTICLE_3":
          return {
            ...state,
            articles: {...state.articles, section3: action.payload.articles.section3},
            title: action.payload.title, index: action.payload.index
          }
    case "SWITCH_COMPONENT":
    return {...state, title: action.payload.title, index: action.payload.index};
    case "EDIT_SLIDE":
      return { ...state, slide: action.payload.slide, title: action.payload.title, index: action.payload.index};
    case "EDIT_ARTICLE":
      return { ...state, title: action.payload.title, index: action.payload.index, meta: action.payload.meta};
    case "ARTICLE_CHANGE":
      return { ...state, title: action.payload.title, index: action.payload.index, meta: action.payload.meta, articles: action.payload.articles};
    case "UPDATE_ARTICLE_1":
      return {
        ...state,
        articles: {...state.articles, section1: action.payload.articles.section1},
        title: action.payload.title, index: action.payload.index
      }
      case "UPDATE_ARTICLE_2":
        return {
          ...state,
          articles: {...state.articles, section2: action.payload.articles.section2},
          title: action.payload.title, index: action.payload.index
        }
        case "UPDATE_ARTICLE_3":
          return {
            ...state,
            articles: {...state.articles, section3: action.payload.articles.section3},
            title: action.payload.title, index: action.payload.index
          }
    case "SET_ARTICLES":
      return {
        ...state,
        articles: action.payload.articles,
        title: action.payload.title, index: action.payload.index
      }
    case "RESET":
      return { ...state };
    default:
      return state;
  }
};

export const ComponentContext = createContext<{
  state: ComponentProps;
  dispatch: Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => null });

export const ComponentContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ComponentContext.Provider value={{ state, dispatch }}>
      {children}
    </ComponentContext.Provider>
  );
};

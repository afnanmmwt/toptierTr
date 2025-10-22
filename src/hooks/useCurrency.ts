"use client";
import { useAppSelector, useAppDispatch } from "@lib/redux/store";
import { setLocale } from "@lib/redux/base";
import { useEffect } from "react";

const useCurrency = () => {
  const dispatch = useAppDispatch();
  const currencies =
    useAppSelector((state) => state?.appData?.data?.currencies) || [];
  const currentCurrency = useAppSelector(
    (state) => state?.root?.currency
  ) as string;
  const defaultCurrency = currencies?.find(
    (currency: any) => currency?.default === "1"
  );
  const currency = currentCurrency ? currentCurrency : defaultCurrency?.name;
  useEffect(() => {
    if (currency) {
      dispatch(setLocale(currency));
    }
  }, [currency, dispatch]);
  return { currency };
};

export default useCurrency;

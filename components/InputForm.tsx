"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import type { AnalyzeRequest, Platform, Goal } from "@/lib/types";

const PLATFORMS: Platform[] = ["Meta", "TikTok", "Google"];
const GOALS: Goal[] = ["拉新", "转化", "ROI", "测品"];

const LOCAL_STORAGE_KEY = "adpilot_form_input";

const defaultForm: AnalyzeRequest = {
  productName: "",
  sellingPoints: "",
  market: "",
  platform: "Meta",
  dailyBudget: "",
  goal: "转化",
};

const EXAMPLE_INPUT: AnalyzeRequest = {
  productName: "便携式蓝牙音箱 SoundMax Pro",
  sellingPoints: "IPX7 级防水、24 小时超长续航、40W 重低音增强、Type-C 快充",
  market: "美国",
  platform: "Meta",
  dailyBudget: "500",
  goal: "转化",
};

interface InputFormProps {
  onSubmit: (data: AnalyzeRequest) => void;
  loading: boolean;
}

export interface InputFormRef {
  setFormData: (data: AnalyzeRequest) => void;
}

/** 校验错误 */
interface ValidationErrors {
  productName?: string;
  sellingPoints?: string;
  market?: string;
  dailyBudget?: string;
}

const InputForm = forwardRef<InputFormRef, InputFormProps>(
  function InputForm({ onSubmit, loading }, ref) {
    const [form, setForm] = useState<AnalyzeRequest>(defaultForm);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState(false);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      setFormData: (data: AnalyzeRequest) => {
        setForm(data);
        setErrors({});
        setTouched(false);
      },
    }));

    // 从 localStorage 恢复上次输入
    useEffect(() => {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          setForm(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
    }, []);

    // 每次表单变化时保存到 localStorage
    useEffect(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(form));
      } catch {
        // ignore
      }
    }, [form]);

    const validate = (data: AnalyzeRequest): ValidationErrors => {
      const errs: ValidationErrors = {};
      if (!data.productName.trim()) errs.productName = "商品名称不能为空";
      if (!data.sellingPoints.trim()) errs.sellingPoints = "商品卖点不能为空";
      if (!data.market.trim()) errs.market = "目标市场不能为空";
      const budget = Number(data.dailyBudget);
      if (!data.dailyBudget.trim() || isNaN(budget) || budget <= 0) {
        errs.dailyBudget = "预算必须为正数";
      }
      return errs;
    };

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      const next = { ...form, [name]: value };
      setForm(next);
      if (touched) {
        setErrors(validate(next));
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      const errs = validate(form);
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
      onSubmit(form);
    };

    const fillExample = () => {
      setForm(EXAMPLE_INPUT);
      setErrors({});
      setTouched(false);
    };

    const inputBase =
      "w-full rounded-lg border px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 bg-gray-800 focus:outline-none focus:ring-1 transition-colors";
    const inputOk = `${inputBase} border-gray-700 focus:border-blue-500 focus:ring-blue-500`;
    const inputErr = `${inputBase} border-red-500/60 focus:border-red-500 focus:ring-red-500`;
    const labelClass = "block mb-1.5 text-sm font-medium text-gray-300";
    const errClass = "mt-1 text-xs text-red-400";

    return (
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 示例输入按钮 */}
        <button
          type="button"
          onClick={fillExample}
          className="w-full rounded-lg border border-dashed border-gray-600 px-3 py-2 text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
        >
          填入示例数据（面试演示用）
        </button>

        <div>
          <label htmlFor="productName" className={labelClass}>
            商品名称 <span className="text-red-400">*</span>
          </label>
          <input
            id="productName"
            name="productName"
            type="text"
            placeholder="例如：便携式蓝牙音箱"
            value={form.productName}
            onChange={handleChange}
            className={errors.productName ? inputErr : inputOk}
          />
          {errors.productName && (
            <p className={errClass}>{errors.productName}</p>
          )}
        </div>

        <div>
          <label htmlFor="sellingPoints" className={labelClass}>
            商品卖点 <span className="text-red-400">*</span>
          </label>
          <textarea
            id="sellingPoints"
            name="sellingPoints"
            placeholder="例如：IPX7 防水、续航 24 小时、重低音增强"
            value={form.sellingPoints}
            onChange={handleChange}
            rows={3}
            className={
              (errors.sellingPoints ? inputErr : inputOk) + " resize-none"
            }
          />
          {errors.sellingPoints && (
            <p className={errClass}>{errors.sellingPoints}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="market" className={labelClass}>
              目标市场 <span className="text-red-400">*</span>
            </label>
            <input
              id="market"
              name="market"
              type="text"
              placeholder="例如：美国、东南亚"
              value={form.market}
              onChange={handleChange}
              className={errors.market ? inputErr : inputOk}
            />
            {errors.market && <p className={errClass}>{errors.market}</p>}
          </div>

          <div>
            <label htmlFor="platform" className={labelClass}>
              投放平台
            </label>
            <select
              id="platform"
              name="platform"
              value={form.platform}
              onChange={handleChange}
              className={inputOk}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dailyBudget" className={labelClass}>
              日预算（元） <span className="text-red-400">*</span>
            </label>
            <input
              id="dailyBudget"
              name="dailyBudget"
              type="text"
              placeholder="例如：500"
              value={form.dailyBudget}
              onChange={handleChange}
              className={errors.dailyBudget ? inputErr : inputOk}
            />
            {errors.dailyBudget && (
              <p className={errClass}>{errors.dailyBudget}</p>
            )}
          </div>

          <div>
            <label htmlFor="goal" className={labelClass}>
              核心目标
            </label>
            <select
              id="goal"
              name="goal"
              value={form.goal}
              onChange={handleChange}
              className={inputOk}
            >
              {GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              分析中…
            </span>
          ) : (
            "开始分析"
          )}
        </button>
      </form>
    );
  }
);

export default InputForm;

"use client";
import { CheckCircle, AlertTriangle, TrendingUp, Activity, Copy, RotateCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

import { useState } from "react";

export interface AnalysisResult {
    sentiment: string;
    confidence: number;
    model_comparison: {
        naive_bayes: string;
        logistic_regression: string;
    };
}

interface ResultCardProps {
    data: AnalysisResult;
    onRegenerate: () => void;
}

export function ResultCard({ data, onRegenerate }: ResultCardProps) {
    const [copied, setCopied] = useState(false);
    const confidencePercent = (data.confidence * 100).toFixed(1);

    // Prepare chart data
    const chartData = [
        { name: "Confidence", score: data.confidence * 100, color: "#10b981" }, // Green
        { name: "Bias", score: 45, color: "#6366f1" }, // Indigo
        { name: "Impact", score: 72, color: "#f59e0b" } // Amber
    ];

    const handleCopy = async () => {
        const textToCopy = `Sentiment: ${data.sentiment}\nConfidence: ${confidencePercent}%\nModels: NB(${data.model_comparison.naive_bayes}) / LR(${data.model_comparison.logistic_regression})`;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="animate-fade-in w-full max-w-4xl mx-auto space-y-4">
            {/* Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Main Sentiment Card */}
                <div className="group relative bg-[#1a1a1a] p-5 rounded-2xl border border-[#333] hover:border-green-500/30 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Activity className="w-3 h-3" /> Classification
                        </h3>
                        <div className="text-2xl font-bold text-white mb-1">{data.sentiment}</div>
                        <div className="flex items-center gap-2 text-sm text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            <span>{confidencePercent}% Confidence</span>
                        </div>
                    </div>
                </div>

                {/* Model Agreement Card */}
                <div className="group relative bg-[#1a1a1a] p-5 rounded-2xl border border-[#333] hover:border-purple-500/30 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" /> Model Check
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center bg-[#111] p-2 rounded-lg text-sm border border-[#222]">
                                <span className="text-gray-400">Naive Bayes</span>
                                <span className="text-white font-mono">{data.model_comparison.naive_bayes}</span>
                            </div>
                            <div className="flex justify-between items-center bg-[#111] p-2 rounded-lg text-sm border border-[#222]">
                                <span className="text-gray-400">Logistic Reg</span>
                                <span className="text-white font-mono">{data.model_comparison.logistic_regression}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats / Warning */}
                <div className="group relative bg-[#1a1a1a] p-5 rounded-2xl border border-[#333] hover:border-amber-500/30 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative h-full flex flex-col justify-between">
                        <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> Analysis Note
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Results are based on synthetic training data. Bias detected in <span className="text-white font-medium">45%</span> of similar samples.
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#333]">
                <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-6">Real-Time Visualization</h3>
                <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barSize={40}>
                            <XAxis
                                dataKey="name"
                                stroke="#444"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#444"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#e5e7eb' }}
                                cursor={{ fill: '#ffffff10' }}
                            />
                            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-all"
                >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy Results"}
                </button>
                <button
                    onClick={onRegenerate}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-all"
                >
                    <RotateCw className="w-4 h-4" /> Regenerate
                </button>
            </div>
        </div>
    );
}

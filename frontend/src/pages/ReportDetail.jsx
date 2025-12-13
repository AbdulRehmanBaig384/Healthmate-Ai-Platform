import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {FileText,Calendar,Download,Brain,AlertCircle,CheckCircle,ArrowLeft,MessageSquare,Utensils,Home,} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";
const ReportDetail = () => {
  const { id } = useParams();
  const { t, isUrdu } = useLanguage();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reports/${id}`);
      setReport(response.data.report);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }};
  if (loading) {
    return (
      <LoadingSpinner
        text={isUrdu ? "Report load ho raha hai..." : "Loading report..."}/>
    );
  }
  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            {isUrdu ? "Report nahi mila" : "Report not found"}
          </h1>
          <Link to="/reports" className="btn-primary">
            {isUrdu ? "Reports pe wapas jayein" : "Back to Reports"}
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <Link
            to="/reports"
            className="inline-flex items-center mb-4 text-primary-600 hover:text-primary-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isUrdu ? "Reports pe wapas" : "Back to Reports"}
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                {report.title}
              </h1>
              <p className="text-lg text-gray-600 capitalize">
                {report.type.replace("_", " ")}
              </p>
            </div>
            <button
              onClick={() => window.open(report.fileUrl, "_blank")}
              className="flex items-center space-x-2 btn-primary">
              <Download className="w-5 h-5" />
              <span>{isUrdu ? "Download" : "Download"}</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* report info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 card">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                {isUrdu ? "Report Information" : "Report Information"}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {isUrdu ? "Report Date" : "Report Date"}
                    </p>
                    <p className="font-medium text-gray-900">
                      {new Date(report.reportDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {isUrdu ? "File Type" : "File Type"}
                    </p>
                    <p className="font-medium text-gray-900">
                      {report.fileType}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ai analysis */}
            {report?.aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 card">
                <div className="flex items-center mb-4 space-x-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isUrdu ? "AI Analysis" : "AI Analysis"}
                  </h2>
                  <div className="ml-auto">
                    <span className="px-2 py-1 text-sm text-purple-800 bg-purple-100 rounded-full">
                      {report.aiAnalysis.confidence}%{" "}
                      {isUrdu ? "Confidence" : "Confidence"}
                    </span>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    {isUrdu ? "Summary" : "Summary"}
                  </h3>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="leading-relaxed text-gray-700">
                      {isUrdu
                        ? report?.aiAnalysis?.summary?.urdu ||
                          "Summary available nahi hai. Please consult your doctor."
                        : report?.aiAnalysis?.summary?.english ||
                          "Summary is not available. Please consult your doctor."}
                    </p>
                  </div>
                </div>

                {/* Abnormal Values */}
                {report.aiAnalysis.abnormalValues &&
                  report.aiAnalysis.abnormalValues.length > 0 && (
                    <div className="mb-6">
                      <h3 className="mb-3 text-lg font-medium text-gray-900">
                        {isUrdu ? "Abnormal Values" : "Abnormal Values"}
                      </h3>
                      <div className="space-y-3">
                        {report.aiAnalysis.abnormalValues.map(
                          (value, index) => (
                            <div
                              key={index}
                              className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-orange-900">
                                  {value.parameter}
                                </h4>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    value.severity === "critical"
                                      ? "bg-red-100 text-red-800"
                                      : value.severity === "high"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                  {value.severity}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                                <div>
                                  <span className="font-medium text-orange-700">
                                    {isUrdu
                                      ? "Current Value:"
                                      : "Current Value:"}
                                  </span>
                                  <span className="ml-2 text-orange-900">
                                    {value.value}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-orange-700">
                                    {isUrdu ? "Normal Range:" : "Normal Range:"}
                                  </span>
                                  <span className="ml-2 text-orange-900">
                                    {value.normalRange}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                {report.aiAnalysis.doctorQuestions &&
                  report.aiAnalysis.doctorQuestions.length > 0 && (
                    <div className="mb-6">
                      <h3 className="flex items-center mb-3 text-lg font-medium text-gray-900">
                        <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                        {isUrdu
                          ? "Questions for Doctor"
                          : "Questions for Doctor"}
                      </h3>
                      <div className="space-y-2">
                        {report?.aiAnalysis?.doctorQuestions?.map(
                          (question, index) => (
                            <div
                              key={index}
                              className="p-3 border border-blue-200 rounded-lg bg-blue-50" >
                              <p className="text-blue-900">{question}</p>
                            </div>
                          )
                        ) || []}
                      </div>
                    </div>
                  )}
                {/* Diet Suggestions */}
                {report.aiAnalysis.dietSuggestions &&
                  report.aiAnalysis.dietSuggestions.length > 0 && (
                    <div className="mb-6">
                      <h3 className="flex items-center mb-3 text-lg font-medium text-gray-900">
                        <Utensils className="w-5 h-5 mr-2 text-green-600" />
                        {isUrdu ? "Diet Suggestions" : "Diet Suggestions"}
                      </h3>
                      <div className="space-y-2">
                        {report.aiAnalysis.dietSuggestions.map(
                          (suggestion, index) => (
                            <div
                              key={index}
                              className="p-3 border border-green-200 rounded-lg bg-green-50">
                              <p className="text-green-900">{suggestion}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                {report.aiAnalysis.homeRemedies &&
                  report.aiAnalysis.homeRemedies.length > 0 && (
                    <div className="mb-6">
                      <h3 className="flex items-center mb-3 text-lg font-medium text-gray-900">
                        <Home className="w-5 h-5 mr-2 text-purple-600" />
                        {isUrdu ? "Home Remedies" : "Home Remedies"}
                      </h3>
                      <div className="space-y-2">
                        {report.aiAnalysis.homeRemedies.map((remedy, index) => (
                          <div
                            key={index}
                            className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                            <p className="text-purple-900">{remedy}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </motion.div>
            )}
          </div>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {isUrdu ? "Analysis Status" : "Analysis Status"}
              </h3>
              <div className="flex items-center space-x-3">
                {report.isAnalyzed ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {report.isAnalyzed
                      ? isUrdu
                        ? "Analysis Complete"
                        : "Analysis Complete"
                      : isUrdu
                      ? "Analysis Pending"
                      : "Analysis Pending"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 border border-yellow-200 card bg-yellow-50">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="mb-1 text-sm font-medium text-yellow-900">
                    {isUrdu ? "Important Notice" : "Important Notice"}
                  </h3>
                  <p className="text-sm text-yellow-700">{t("disclaimer")}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;

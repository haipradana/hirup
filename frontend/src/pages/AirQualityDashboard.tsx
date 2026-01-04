import { useState, useEffect, Suspense, lazy } from "react";
import { useMutation } from "@tanstack/react-query";
import { RefreshCw, Play, Download, MapPin, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { DateTimeSelector } from "@/components/dashboard/DateTimeSelector";
import { AtmosphereInputs } from "@/components/dashboard/AtmosphereInputs";
import { WindRainInputs } from "@/components/dashboard/WindRainInputs";
import { SensorDataInputs } from "@/components/dashboard/SensorDataInputs";
import { GaugeChart } from "@/components/dashboard/GaugeChart";
import ReactSpeedometer from "react-d3-speedometer";
import { LineHistoryChart } from "@/components/dashboard/LineHistoryChart";
import { QualityBadge } from "@/components/dashboard/QualityBadge";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { LoadingSpinner } from "@/components/dashboard/LoadingSpinner";
import { predictEstimator, predictSimple, predictPro, type WeatherParams, type SimpleParams, type ProParams } from "@/lib/api";
type TabType = "estimator" | "simple" | "pro";
const AirQualityDashboard = () => {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("estimator");

  // DateTime state - set to current local time
  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();
    // Format to local datetime string for datetime-local input
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });

  // Atmosphere state
  const [temperature, setTemperature] = useState(28);
  const [humidity, setHumidity] = useState(70);
  const [pressure, setPressure] = useState(990);
  const [solarRadiation, setSolarRadiation] = useState(500);

  // Wind & Rain state
  const [windSpeedAvg, setWindSpeedAvg] = useState(0.6);
  const [windSpeedMax, setWindSpeedMax] = useState(2.2);
  const [windDirection, setWindDirection] = useState(270);
  const [rainfall, setRainfall] = useState(0);

  // Sensor data state
  const [pm25Current, setPm25Current] = useState(18);
  const [pm25_1hAgo, setPm25_1hAgo] = useState(17);
  const [pm25_2hAgo, setPm25_2hAgo] = useState(23);

  // Result state
  const [result, setResult] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Reset only result when tab changes (keep input values)
  useEffect(() => {
    setResult(null);
    setLastUpdated(null);
  }, [activeTab]);

  const getWeatherParams = (): WeatherParams => ({
    prediction_time: dateTime,
    rr: rainfall,
    ws_avg: windSpeedAvg,
    ws_max: windSpeedMax,
    wd_avg: windDirection,
    tt_air_avg: temperature,
    rh_avg: humidity,
    sr_avg: solarRadiation,
    pp_air: pressure
  });
  const estimatorMutation = useMutation({
    mutationFn: predictEstimator,
    onSuccess: data => {
      setResult(data.predicted_pm25);
      setLastUpdated(new Date().toLocaleTimeString());
      toast({
        title: "Prediction Complete",
        description: `PM2.5 forecast: ${data.predicted_pm25.toFixed(1)} µg/m³`,
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Prediction Failed",
        description: error.message || "Could not connect to the prediction server. Please try again.",
        variant: "destructive"
      });
    }
  });
  const simpleMutation = useMutation({
    mutationFn: predictSimple,
    onSuccess: data => {
      setResult(data.predicted_pm25);
      setLastUpdated(new Date().toLocaleTimeString());
      toast({
        title: "Prediction Complete",
        description: `PM2.5 forecast: ${data.predicted_pm25.toFixed(1)} µg/m³`,
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Prediction Failed",
        description: error.message || "Could not connect to the prediction server. Please try again.",
        variant: "destructive"
      });
    }
  });
  const proMutation = useMutation({
    mutationFn: predictPro,
    onSuccess: data => {
      setResult(data.predicted_pm25);
      setLastUpdated(new Date().toLocaleTimeString());
      toast({
        title: "Prediction Complete",
        description: `PM2.5 forecast: ${data.predicted_pm25.toFixed(1)} µg/m³`,
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Prediction Failed",
        description: error.message || "Could not connect to the prediction server. Please try again.",
        variant: "destructive"
      });
    }
  });
  const isLoading = estimatorMutation.isPending || simpleMutation.isPending || proMutation.isPending;
  const handleRunSimulation = () => {
    const weatherParams = getWeatherParams();
    if (activeTab === "estimator") {
      estimatorMutation.mutate(weatherParams);
    } else if (activeTab === "simple") {
      const params: SimpleParams = {
        ...weatherParams,
        pm25_current: pm25Current
      };
      simpleMutation.mutate(params);
    } else {
      const params: ProParams = {
        ...weatherParams,
        pm25_current: pm25Current,
        pm25_1h_ago: pm25_1hAgo,
        pm25_2h_ago: pm25_2hAgo
      };
      proMutation.mutate(params);
    }
  };
  const handleReset = () => {
    setTemperature(24);
    setHumidity(45);
    setPressure(1013);
    setSolarRadiation(500);
    setWindSpeedAvg(3.5);
    setWindSpeedMax(7.2);
    setWindDirection(45);
    setRainfall(0);
    setPm25Current(35);
    setPm25_1hAgo(48);
    setPm25_2hAgo(35);
    setResult(null);
  };
  const getTabTitle = () => {
    switch (activeTab) {
      case "estimator":
        return "Estimasi Berbasis Cuaca";
      case "simple":
        return "Prediksi Cepat";
      case "pro":
        return "Prediksi Presisi";
    }
  };
  const getTabDescription = () => {
    switch (activeTab) {
      case "estimator":
        return "Simulasi nilai PM2.5 hanya menggunakan variabel meteorologi tanpa sensor kualitas udara PM2.5";
      case "simple":
        return "Memanfaatkan data sensor saat ini untuk memberikan prediksi PM2.5 dalam 1 jam mendatang.";
      case "pro":
        return "Prediksi PM2.5 menggunakan rekam jejak sensor 3 jam terakhir untuk meminimalisir kesalahan prediksi akibat fluktuasi cuaca";
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/hirup-pm25.png" 
              alt="HIRUP Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as TabType)} className="hidden md:block">
            <TabsList className="bg-muted">
              <TabsTrigger value="estimator" className="data-[state=active]:bg-card">
                Estimator
              </TabsTrigger>
              <TabsTrigger value="simple" className="data-[state=active]:bg-card">
                Simple Forecast
              </TabsTrigger>
              <TabsTrigger value="pro" className="data-[state=active]:bg-card">
                Pro Forecast
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400 hidden sm:inline">
                Stasiun Klimatologi Mlati
              </span>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400 sm:hidden">
                Staklim Mlati
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="md:hidden border-b border-border bg-card p-4">
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as TabType)}>
          <TabsList className="w-full bg-muted">
            <TabsTrigger value="estimator" className="flex-1 data-[state=active]:bg-card text-xs">
              Estimator
            </TabsTrigger>
            <TabsTrigger value="simple" className="flex-1 data-[state=active]:bg-card text-xs">
              Simple
            </TabsTrigger>
            <TabsTrigger value="pro" className="flex-1 data-[state=active]:bg-card text-xs">
              Pro
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title section */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{getTabTitle()}</h1>
                <p className="text-muted-foreground mt-1">{getTabDescription()}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset} className="hidden sm:flex gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-950/20 dark:hover:text-blue-400 dark:hover:border-blue-800">
                <RefreshCw className="w-4 h-4" />
                Reset Defaults
              </Button>
            </div>

            {/* Date Time */}
            <DateTimeSelector dateTime={dateTime} setDateTime={setDateTime} />

            {/* Atmosphere */}
            <AtmosphereInputs temperature={temperature} setTemperature={setTemperature} humidity={humidity} setHumidity={setHumidity} pressure={pressure} setPressure={setPressure} solarRadiation={solarRadiation} setSolarRadiation={setSolarRadiation} />

            {/* Wind & Rain */}
            <WindRainInputs windSpeedAvg={windSpeedAvg} setWindSpeedAvg={setWindSpeedAvg} windSpeedMax={windSpeedMax} setWindSpeedMax={setWindSpeedMax} windDirection={windDirection} setWindDirection={setWindDirection} rainfall={rainfall} setRainfall={setRainfall} />

            {/* Sensor Data - Only for Simple and Pro */}
            {(activeTab === "simple" || activeTab === "pro") && <SensorDataInputs pm25Current={pm25Current} setPm25Current={setPm25Current} pm25_1hAgo={pm25_1hAgo} setPm25_1hAgo={setPm25_1hAgo} pm25_2hAgo={pm25_2hAgo} setPm25_2hAgo={setPm25_2hAgo} showHistory={activeTab === "pro"} />}
          </div>

          {/* Right Column - Results (Sticky on Desktop) */}
          <div className="space-y-6 lg:sticky lg:top-20 lg:h-fit lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pb-6 scrollbar-thin">
            <div className="dashboard-section space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Forecast Analysis</h2>
                {result !== null && <div className="flex items-center gap-1.5">
                    {/* <span className="w-2 h-2 bg-success rounded-full animate-pulse-ring" />
                    <span className="text-xs text-muted-foreground">Live</span> */}
                  </div>}
              </div>

              {isLoading ? <LoadingSpinner /> : result !== null ? <div className="space-y-6 animate-fade-in">
                  {/* Quality Badge */}
                  <div className="flex justify-center">
                    <QualityBadge value={result} />
                  </div>

                  {/* Big result number */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">PREDICTED PM2.5</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-6xl font-bold text-foreground">{result.toFixed(1)}</span>
                      <span className="text-xl text-muted-foreground">µg/m³</span>
                    </div>
                  </div>

                  {/* Chart based on tab */}
                  <div className="pt-4">
                    {activeTab === "estimator" && <GaugeChart value={result} />}
                    {activeTab === "simple" && <div className="space-y-4">
                        <div className="flex justify-center items-center min-h-[250px]">
                          <ReactSpeedometer
                            maxValue={500}
                            value={result}
                            needleColor="#1f2937"
                            startColor="#4ade80"
                            segments={5}
                            endColor="#1f2937"
                            customSegmentStops={[0, 15.5, 55.4, 150.4, 250.4, 500]}
                            segmentColors={["#4ade80", "#eab308", "#f97316", "#ef4444", "#1f2937"]}
                            ringWidth={40}
                            needleTransitionDuration={1500}
                            textColor="#000000"
                            valueFormat="d"
                            currentValueText={`${result.toFixed(1)} µg/m³`}
                            labelFontSize="14px"
                            valueTextFontSize="18px"
                            width={320}
                            height={240}
                            minValue={0}
                          />
                        </div>
                      </div>}
                    {activeTab === "pro" && <LineHistoryChart pm25_2h_ago={pm25_2hAgo} pm25_1h_ago={pm25_1hAgo} pm25_current={pm25Current} forecast={result} />}
                  </div>
                </div> : <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Wind className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Adjust parameters and run the simulation to see results
                  </p>
                </div>}
            </div>

            {/* Recommendation */}
            {result !== null && !isLoading && <RecommendationCard pm25Value={result} />}

            {/* Run Button - BMKG Blue Style */}
            <Button 
              onClick={handleRunSimulation} 
              disabled={isLoading} 
              className="w-full h-14 text-base font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50 transition-all duration-300"
            >
              {isLoading ? <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Calculating...
                </> : <>
                  {activeTab === "pro" ? <Play className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {activeTab === "pro" ? "Run Simulation" : "Run Simulation"}
                </>}
            </Button>

            {/* Last updated */}
            {lastUpdated && <p className="text-center text-xs text-muted-foreground">
                Last updated: {lastUpdated}
              </p>}
          </div>
        </div>
      </main>
    </div>;
};
export default AirQualityDashboard;
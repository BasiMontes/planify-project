import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/entities/User";
import { useApp } from "@/components/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  ChevronLeft, 
  Wallet, 
  Target, 
  TrendingUp, 
  Users,
  PieChart,
  Calendar,
  Star,
  CheckCircle
} from "lucide-react";

const guideSteps = [
  {
    id: 1,
    title: "¡Bienvenido a Planify!",
    content: "Tu asistente personal para gestionar finanzas de forma colaborativa.",
    icon: Star,
    tips: [
      "Controla tus gastos mensuales",
      "Define objetivos de ahorro",
      "Colabora con tu pareja o familia",
      "Visualiza tu progreso financiero"
    ]
  },
  {
    id: 2,
    title: "Crear tu Primer Presupuesto",
    content: "Los presupuestos te ayudan a controlar los gastos mensuales por categorías.",
    icon: Wallet,
    tips: [
      "Ve a la página 'Presupuestos'",
      "Haz clic en '+ Nuevo Presupuesto'",
      "Define categorías como Vivienda, Comida, Ocio",
      "Establece límites mensuales para cada categoría"
    ]
  },
  {
    id: 3,
    title: "Definir Objetivos de Ahorro",
    content: "Los objetivos te motivan a ahorrar para cosas que realmente importan.",
    icon: Target,
    tips: [
      "Ve a la página 'Objetivos'",
      "Crea objetivos como 'Vacaciones de verano'",
      "Define cuánto quieres ahorrar y para cuándo",
      "Ve tu progreso en tiempo real"
    ]
  },
  {
    id: 4,
    title: "Registrar Gastos e Ingresos",
    content: "Mantén un registro detallado de todas tus transacciones financieras.",
    icon: TrendingUp,
    tips: [
      "Ve a la página 'Balance'",
      "Registra ingresos con '+ Ingreso'",
      "Registra gastos con '+ Gasto'",
      "Los gastos se asignan automáticamente a presupuestos"
    ]
  },
  {
    id: 5,
    title: "Colaborar con tu Equipo",
    content: "Invita a familiares o pareja para gestionar finanzas juntos.",
    icon: Users,
    tips: [
      "Ve a tu 'Perfil' → Tab 'Colaboración'",
      "Selecciona el presupuesto u objetivo a compartir",
      "Introduce el email de tu colaborador",
      "Define los permisos: Ver, Editar o Administrar"
    ]
  },
  {
    id: 6,
    title: "Monitorear tu Progreso",
    content: "El Dashboard te muestra un resumen completo de tu salud financiera.",
    icon: PieChart,
    tips: [
      "Ve la página 'Home' para el resumen general",
      "Revisa las barras de progreso de presupuestos",
      "Monitorea el avance hacia tus objetivos",
      "Recibe alertas cuando te acerques a los límites"
    ]
  },
  {
    id: 7,
    title: "¡Listo para Empezar!",
    content: "Ya tienes todas las herramientas para tomar control de tus finanzas.",
    icon: CheckCircle,
    tips: [
      "Empieza creando tu primer presupuesto",
      "Define al menos un objetivo de ahorro",
      "Registra tus primeras transacciones",
      "Invita a alguien especial a colaborar"
    ]
  }
];

export default function UserGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const { refreshUser } = useApp();
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const finishGuide = async () => {
    try {
      await User.updateMyUserData({ has_completed_onboarding: true });
      await refreshUser();
      navigate('/');
    } catch (error) {
      console.error("Error finalizando la guía:", error);
      navigate('/'); // Navigate away even if update fails
    }
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const currentGuideStep = guideSteps[currentStep];
  const IconComponent = currentGuideStep.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Guía de Usuario
          </h1>
          <p className="text-white/80 text-lg">
            Aprende a usar Planify en pocos minutos
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/70 text-sm">
              Paso {currentStep + 1} de {guideSteps.length}
            </span>
            <span className="text-white/70 text-sm">
              {Math.round(((currentStep + 1) / guideSteps.length) * 100)}% Completado
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mb-8 flex-wrap gap-2">
          {guideSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-white scale-125' 
                  : index < currentStep 
                  ? 'bg-emerald-400' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {currentGuideStep.title}
            </h2>
            <p className="text-white/80 text-lg mb-8">
              {currentGuideStep.content}
            </p>
          </div>

          <div className="text-left max-w-2xl mx-auto mb-8">
            <div className="space-y-3">
              {currentGuideStep.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  </div>
                  <p className="text-white/90">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="bg-transparent border-white/30 text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <span className="text-white/60 text-sm">
              {currentStep + 1} / {guideSteps.length}
            </span>

            {currentStep === guideSteps.length - 1 ? (
              <Button
                onClick={finishGuide}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                ¡Finalizar!
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {currentStep === guideSteps.length - 1 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="bg-blue-500/20 text-blue-300 border-blue-400/30 hover:bg-blue-500/30">
              <Wallet className="w-4 h-4 mr-2" />
              Presupuestos
            </Button>
            <Button className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 hover:bg-emerald-500/30">
              <Target className="w-4 h-4 mr-2" />
              Objetivos
            </Button>
            <Button className="bg-purple-500/20 text-purple-300 border-purple-400/30 hover:bg-purple-500/30">
              <TrendingUp className="w-4 h-4 mr-2" />
              Balance
            </Button>
            <Button className="bg-pink-500/20 text-pink-300 border-pink-400/30 hover:bg-pink-500/30">
              <Users className="w-4 h-4 mr-2" />
              Colaborar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
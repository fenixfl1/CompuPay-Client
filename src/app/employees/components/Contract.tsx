import ConditionalComponent from "@/components/ConditionalComponent"
import capitalize from "@/helpers/capitalize"
import formatter from "@/helpers/formatter"
import { Employee } from "@/interfaces/user"
import { FormInstance } from "antd"
import moment from "moment"
import React from "react"
import styled from "styled-components"

const Container = styled.div`
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: ${({ theme }) => theme.borderRadius};

  .container {
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    text-align: center;
    font-size: 24px;
  }
  p {
    margin: 10px 0;
  }
  .section-title {
    font-weight: bold;
    margin-top: 20px;
  }
  .signature {
    margin-top: 40px;
  }
  .signature div {
    margin-top: 40px;
  }
`

interface ContractProps {
  form: FormInstance
  employee: Employee
}

const Contract: React.FC<ContractProps> = ({ employee }) => {
  return (
    <Container>
      <h1>CONTRATO DE EMPLEO</h1>
      <p>
        <strong>Entre"</strong>
      </p>
      <p>
        <strong>Nombre del Empleador:</strong> [Empresa XYZ S.A.]
      </p>
      <p>
        <strong>Dirección del Empleador:</strong> Calle Falsa 123, Ciudad, País
      </p>
      <p>
        <strong>Representante del Empleador:</strong> Sr. Juan Pérez, Gerente
        General
      </p>
      <p>
        <strong>Y:</strong>
      </p>
      <p>
        <strong>Nombre del Empleado:</strong> {employee.NAME}{" "}
        {employee.LAST_NAME}
      </p>
      <p>
        <strong>Dirección del Empleado:</strong> {employee.ADDRESS}
      </p>
      <p>
        <strong>Documento de identidad del Empleado:</strong>{" "}
        {formatter({ value: employee.IDENTITY_DOCUMENT, format: "document" })}
      </p>
      <p>
        <strong>Fecha de Inicio del Contrato:</strong>{" "}
        {formatter({ value: `${employee.HIRED_DATE}`, format: "date" })}
      </p>
      <p className="section-title">1. OBJETO DEL CONTRATO</p>
      <p>
        El presente contrato tiene por objeto establecer las condiciones
        laborales bajo las cuales el Empleador contrata al Empleado para
        desempeñar las funciones de <strong>{employee.ROLES?.[0].NAME}</strong>
        bajo la supervisión de {employee.SUPERVISOR}.
      </p>
      <p className="section-title">2. DURACIÓN DEL CONTRATO</p>
      <p>
        Este contrato tendrá una duración [determinada/indeterminada],
        comenzando el{" "}
        {formatter({ value: `${employee.BIRTH_DATE}`, format: "long_date" })} y,
        en caso de ser determinado, finalizando el{" "}
        {formatter({ value: `${employee.BIRTH_DATE}`, format: "long_date" })}.
        Puede ser renovado o extendido por acuerdo mutuo entre ambas partes.
      </p>
      <p className="section-title">3. PERÍODO DE PRUEBA</p>
      <p>
        El Empleado estará sujeto a un período de prueba de 3 meses, durante el
        cual cualquiera de las partes podrá finalizar el contrato sin previo
        aviso y sin derecho a indemnización.
      </p>
      <p className="section-title">4. JORNADA LABORAL</p>
      <p>
        El Empleado trabajará 40 horas por semana, de Lunes a Viernes, en un
        horario de 8:00 AM a 5:00 PM, con un descanso para almorzar de 1 hora.
      </p>
      <p className="section-title">5. REMUNERACIÓN</p>
      <p>
        El Empleador pagará al Empleado un salario bruto de {employee.SALARY}{" "}
        {employee.CURRENCY}
        por mes, pagadero mensual en la cuenta bancaria designada por el
        Empleado. Además, el Empleado será elegible para los siguientes
        beneficios:
      </p>
      <ul>
        <ConditionalComponent
          condition={!!employee?.BENEFITS}
          fallback={<li>No se han especificado beneficios adicionales.</li>}
        >
          {employee.BENEFITS?.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ConditionalComponent>
      </ul>
      <p className="section-title">6. OBLIGACIONES DEL EMPLEADO</p>
      <p>El Empleado se compromete a:</p>
      <ul>
        <li>
          Desempeñar sus funciones con diligencia, responsabilidad y lealtad.
        </li>
        <li>
          Cumplir con las políticas, procedimientos y normativas de la empresa.
        </li>
        <li>
          Mantener la confidencialidad de la información sensible y propiedad
          intelectual de la empresa.
        </li>
      </ul>
      <p className="section-title">7. OBLIGACIONES DEL EMPLEADOR</p>
      <p>El Empleador se compromete a:</p>
      <ul>
        <li>
          Proporcionar al Empleado los recursos y herramientas necesarios para
          el desempeño de sus funciones.
        </li>
        <li>Pagar el salario y beneficios acordados en tiempo y forma.</li>
        <li>
          Respetar los derechos laborales del Empleado conforme a la legislación
          vigente.
        </li>
      </ul>
      <p className="section-title">8. TERMINACIÓN DEL CONTRATO</p>
      <p>
        Este contrato puede ser terminado por cualquiera de las partes mediante
        un aviso escrito con 28 días de antelación. En caso de terminación por
        causa justificada, el contrato podrá ser finalizado de inmediato, sin
        derecho a indemnización, conforme a la legislación vigente.
      </p>
      <p className="section-title">9. CONFIDENCIALIDAD</p>
      <p>
        El Empleado se compromete a mantener la confidencialidad de toda la
        información y datos obtenidos durante el curso de su empleo, y no
        divulgar dicha información a terceros sin el consentimiento previo por
        escrito del Empleador.
      </p>
      <p className="section-title">10. LEY APLICABLE Y JURISDICCIÓN</p>
      <p>
        Este contrato se regirá e interpretará de acuerdo con las leyes de
        [País], y las partes se someten a la jurisdicción exclusiva de los
        tribunales de [Ciudad, País] para la resolución de cualquier disputa que
        surja del mismo.
      </p>
      <div className="signature">
        <div>
          _________________________
          <br />
          [Nombre del Representante del Empleador]
          <br />
          [Posición]
          <br />
          [Fecha]
        </div>
        <div>
          _________________________
          <br />
          {employee.NAME} {employee.LAST_NAME}
          <br />
          {capitalize(
            formatter({
              value: moment().toISOString(),
              format: "long_date",
            })
          )}
        </div>
      </div>
    </Container>
  )
}

export default Contract

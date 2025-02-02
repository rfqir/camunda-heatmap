export const diagramXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_0na76wv" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.19.0" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.20.0">
  <bpmn:process id="aaa" name="aaa" isExecutable="true" camunda:candidateStarterGroups="GmHr,Purchase,StafIT" camunda:historyTimeToLive="180">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:extensionElements>
        <camunda:formData>
          <camunda:formField id="id" label="id" type="string" defaultValue="rajan" />
          <camunda:formField id="timerCounter" label="timerCounter" type="long" defaultValue="0" />
          <camunda:formField id="priority" label="priority" type="string" defaultValue="high" />
          <camunda:formField id="jenis" label="jenis" type="enum">
            <camunda:value id="instant" name="instant" />
            <camunda:value id="regular" name="regular" />
          </camunda:formField>
        </camunda:formData>
      </bpmn:extensionElements>
      <bpmn:outgoing>Flow_0ljmat4</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:userTask id="pick" name="pick" camunda:candidateGroups="StafIT">
      <bpmn:incoming>Flow_10vg7xu</bpmn:incoming>
      <bpmn:outgoing>Flow_0zuh4m6</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_0ljmat4" sourceRef="StartEvent_1" targetRef="Activity_0drccos" />
    <bpmn:sequenceFlow id="Flow_10vg7xu" sourceRef="Activity_0drccos" targetRef="pick" />
    <bpmn:businessRuleTask id="Activity_0drccos" name="setDueDate" camunda:resultVariable="dmn" camunda:decisionRef="dueDate_1" camunda:mapDecisionResult="singleResult">
      <bpmn:incoming>Flow_0ljmat4</bpmn:incoming>
      <bpmn:outgoing>Flow_10vg7xu</bpmn:outgoing>
    </bpmn:businessRuleTask>
    <bpmn:userTask id="box" name="box">
      <bpmn:incoming>Flow_0zuh4m6</bpmn:incoming>
      <bpmn:outgoing>Flow_0ix5b0f</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_0zuh4m6" sourceRef="pick" targetRef="box" />
    <bpmn:userTask id="check" name="check">
      <bpmn:incoming>Flow_0ix5b0f</bpmn:incoming>
      <bpmn:outgoing>Flow_1675ld6</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_0ix5b0f" sourceRef="box" targetRef="check" />
    <bpmn:endEvent id="Event_1tdi3mq">
      <bpmn:incoming>Flow_1675ld6</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1675ld6" sourceRef="check" targetRef="Event_1tdi3mq" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="aaa">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="99" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_11omba2_di" bpmnElement="pick">
        <dc:Bounds x="400" y="77" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_18tr9l4_di" bpmnElement="Activity_0drccos">
        <dc:Bounds x="250" y="77" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0lbmjt4_di" bpmnElement="box">
        <dc:Bounds x="550" y="77" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_09gng9v_di" bpmnElement="check">
        <dc:Bounds x="700" y="77" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1tdi3mq_di" bpmnElement="Event_1tdi3mq">
        <dc:Bounds x="852" y="99" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_0ljmat4_di" bpmnElement="Flow_0ljmat4">
        <di:waypoint x="215" y="117" />
        <di:waypoint x="250" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_10vg7xu_di" bpmnElement="Flow_10vg7xu">
        <di:waypoint x="350" y="117" />
        <di:waypoint x="400" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0zuh4m6_di" bpmnElement="Flow_0zuh4m6">
        <di:waypoint x="500" y="117" />
        <di:waypoint x="550" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0ix5b0f_di" bpmnElement="Flow_0ix5b0f">
        <di:waypoint x="650" y="117" />
        <di:waypoint x="700" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1675ld6_di" bpmnElement="Flow_1675ld6">
        <di:waypoint x="800" y="117" />
        <di:waypoint x="852" y="117" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>

`;

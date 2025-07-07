import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Form, Row, Col, Label } from "reactstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { getLayersForManager, updateLayersForManager } from "../../../../redux/action";

const AccessibilityDropdown = ({
    accessibilities,
    managerId,
    isActive,
    setActiveToggleIndex,
    getManagerCallback
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [layers, setLayers] = useState([]);
    const [selectedLayers, setSelectedLayers] = useState([]);
    const { handleSubmit, control, reset } = useForm();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // Fetch layers on mount
    useEffect(() => {
        dispatch(
            getLayersForManager({
                callback: (res) => {
                    const data = res?.data?.map((ele) => ({
                        label: `${ele?.username} #${ele?.role}`,
                        value: ele?._id,
                    }));
                    setLayers(data);
                },
            })
        );
    }, [dispatch]);

    // Reset dropdown data when inactive
    useEffect(() => {
        if (!isActive) {
            reset({ layers: [] });
            setSelectedLayers([]);
            setShowDropdown(false);
        }
    }, [isActive, reset]);

    // Handle the Form Clear Button
    const handleClear = () => {
        reset({ layers: [] });
        setSelectedLayers([]);
        setShowDropdown(false);
        getManagerCallback();
    };

    // Handle form submission
    const onSubmit = (data) => {
        data = { ...data, manager_id: managerId, isSingle: false };
        dispatch(
            updateLayersForManager({
                data,
                callback: (res) => {
                    if (res?.meta?.code === 200) {
                        handleClear();
                    }
                },
            })
        );
    };

    // Handle toggle button click
    const handleToggle = () => {
        setActiveToggleIndex(); // Mark this dropdown as active
        setShowDropdown((prev) => !prev); // Toggle dropdown view
    };

    // Remove item from list
    const handleRemove = (indexToRemove, access) => {
        // const updatedList = accessibilities.filter((_, index) => index !== indexToRemove);

        let manager = { label: access?.username, value: access?._id };
        let layer = [];
        layer.push(manager);
        let data = { layers: layer, manager_id: managerId, isSingle: true };
        dispatch(
            updateLayersForManager({
                data,
                callback: (res) => {
                    if (res?.meta?.code === 200) {
                        handleClear();
                    }
                },
            })
        );
        // getManagerCallback(updatedList); // Update parent component state (or API call)
    };

    return (
        <div className="d-flex flex-column">
            {/* Toggle Button */}
            <button
                className="btn btn-secondary mb-2"
                onClick={handleToggle}
                style={{ alignSelf: "flex-start" }}
            >
                {showDropdown ? "Show List" : "Edit List"}
            </button>

            {/* Conditionally Render List or Form */}
            {showDropdown ? (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="d-flex flex-wrap">
                        <Col xs="12" sm="6" md="4" className="mb-3">
                            <Label htmlFor="layers">{t("Select Layers")}</Label>
                            <Controller
                                name="layers"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={layers}
                                        isMulti
                                        value={selectedLayers}
                                        onChange={(options) => {
                                            setSelectedLayers(options);
                                            field.onChange(options);
                                        }}
                                        placeholder="Select Layers"
                                        classNamePrefix="react-select"
                                        styles={{
                                            container: (base) => ({
                                                ...base,
                                                width: "100%",
                                            }),
                                            control: (base) => ({
                                                ...base,
                                                minWidth: "300px",
                                                maxWidth: "100%",
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                minWidth: "300px",
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </Col>
                    </Row>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </Form>
            ) : (
                <ul>
                    {accessibilities.map((access, index) => (
                        <li
                            key={index}
                            className="d-flex justify-content-between align-items-center"
                        >
                            <span className="me-2">
                                {`${index + 1}. ${access.username} #${access.role}`}
                            </span>
                            <button
                                className="btn btn-danger p-0 d-flex justify-content-center align-items-center"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    fontSize: '12px',
                                    lineHeight: '1', // Ensures the icon is vertically centered
                                    // borderRadius: '50%', // Makes it circular
                                }}
                                onClick={() => handleRemove(index, access)}
                            >
                                &times;
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AccessibilityDropdown;
